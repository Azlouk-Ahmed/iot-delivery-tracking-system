const mqtt = require("mqtt");
const { randomUUID } = require("crypto");
const Vehicle = require("../models/vehicle");
const Trajectory = require("../models/trajectory");
const Company = require("../models/company");
const ALLOWED_ROLES = require("../config/roles-list");
const logger = require("../utils/logger");
const brokerConfig = require("../config/mqtt-config");

module.exports = (io) => {
  const activeVehicles = new Map();
  const HEARTBEAT_TIMEOUT = 30000;
  const heartbeatTimeouts = new Map();

  const brokerUrl = brokerConfig.host;
  const options = {
    clientId: brokerConfig.options.clientId,
    clean: brokerConfig.options.clean,
  };

  logger.info("MQTT", "Connecting to broker...");
  const client = mqtt.connect(brokerUrl, options);

  // ---------------- EMIT HELPERS ----------------
  const emitToAuthorizedClients = (eventName, data, companyId = null) => {
    io.sockets.sockets.forEach((socket) => {
      const userData = socket.userData;
      if (!userData) return;

      // Super Admin - sees everything
      if (userData.role === ALLOWED_ROLES.SUPER_ADMIN) {
        socket.emit(eventName, data);
        return;
      }

      // Admin - sees vehicles from their company
      if (userData.role === ALLOWED_ROLES.ADMIN && companyId) {
        if (userData.companyId === companyId.toString()) {
          socket.emit(eventName, data);
        }
        return;
      }

      // User - sees only vehicles with their active deliveries
      if (userData.role === ALLOWED_ROLES.USER) {
        if (userData.allowedVehicles && userData.allowedVehicles.includes(data.vehicleId)) {
          socket.emit(eventName, data);
        }
      }
    });
  };

  // ---------------- TIMEOUT HANDLING ----------------
  const handleVehicleTimeout = async (vehicleId) => {
    const vehicle = await Vehicle.findOne({ vehicleId })
      .populate("driverId", "name")
      .populate("companyId", "name");

    if (!vehicle) return;

    const driverName = vehicle.driverId.name;
    const model = vehicle.model;
    const companyId = vehicle.companyId._id;
    const companyName = vehicle.companyId.name;
    const session = activeVehicles.get(vehicleId);

    activeVehicles.delete(vehicleId);
    clearTimeout(heartbeatTimeouts.get(vehicleId));
    heartbeatTimeouts.delete(vehicleId);

    logger.warn(
      "MQTT",
      `Vehicle timeout detected: ${driverName} (${vehicleId} - ${model}) [${companyName}]`
    );

    const statusData = {
      vehicleId,
      status: "TIMEOUT",
      driverName,
      model,
      companyId,
      companyName,
      sessionId: session?.sessionId,
      timestamp: new Date().toISOString(),
      reason: "No GPS updates for 30 seconds",
    };

    emitToAuthorizedClients("vehicle-status", statusData, companyId);
    io.to(`vehicle-${vehicleId}`).emit("vehicle-stopped", statusData);
  };

  // ---------------- HEARTBEAT ----------------
  const startHeartbeat = (vehicleId) => {
    clearTimeout(heartbeatTimeouts.get(vehicleId));
    const timeout = setTimeout(() => handleVehicleTimeout(vehicleId), HEARTBEAT_TIMEOUT);
    heartbeatTimeouts.set(vehicleId, timeout);
    logger.info("Heartbeat", `Started for ${vehicleId} (${HEARTBEAT_TIMEOUT / 1000}s timeout)`);
  };

  const resetHeartbeat = (vehicleId) => {
    if (activeVehicles.has(vehicleId)) {
      clearTimeout(heartbeatTimeouts.get(vehicleId));
      startHeartbeat(vehicleId);
      logger.info("Heartbeat", `Reset for ${vehicleId}`);
    }
  };

  // ---------------- MQTT CONNECTION EVENTS ----------------
  client.on("connect", () => {
    logger.success("MQTT", "Connected to broker");

    client.subscribe("vehicles/+/status", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (status): ${err.message}`);
      else logger.success("MQTT", "Subscribed to topic: vehicles/+/status");
    });

    client.subscribe("vehicles/+/gps", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (gps): ${err.message}`);
      else logger.success("MQTT", "Subscribed to topic: vehicles/+/gps");
    });
  });

  // ---------------- MESSAGE HANDLING ----------------
  client.on("message", async (topic, message) => {
    try {
      const [_, vehicleId, messageType] = topic.split("/");
      const payload = JSON.parse(message.toString());
      const timestamp = new Date(payload.timestamp).toLocaleTimeString();

      const vehicle = await Vehicle.findOne({ vehicleId })
        .populate("driverId", "name")
        .populate("companyId", "name");

      if (!vehicle) {
        logger.warn("MQTT", `Unknown vehicle received: ${vehicleId}`);
        return;
      }

      const driverName = vehicle.driverId.name;
      const model = vehicle.model;
      const companyId = vehicle.companyId._id;
      const companyName = vehicle.companyId.name;

      // ---------- Vehicle Status ----------
      if (messageType === "status") {
        if (payload.status === "ON") {
          const sessionId = randomUUID();

          activeVehicles.set(vehicleId, {
            sessionId,
            driverName,
            model,
            companyId: companyId.toString(),
          });

          startHeartbeat(vehicleId);

          logger.success(
            "Vehicle",
            `${driverName} turned ON vehicle (${vehicleId} - ${model}) [${companyName}]`
          );
          logger.info("Vehicle", `Listening for GPS updates from ${driverName}`);

          const statusData = {
            vehicleId,
            status: "ON",
            driverName,
            model,
            companyId,
            companyName,
            sessionId,
            timestamp: payload.timestamp,
          };

          emitToAuthorizedClients("vehicle-status", statusData, companyId);
          io.to(`vehicle-${vehicleId}`).emit("vehicle-started", statusData);
        } else {
          const session = activeVehicles.get(vehicleId);

          activeVehicles.delete(vehicleId);
          clearTimeout(heartbeatTimeouts.get(vehicleId));
          heartbeatTimeouts.delete(vehicleId);

          logger.info(
            "Vehicle",
            `${driverName} turned OFF vehicle (${vehicleId} - ${model}) [${companyName}]`
          );

          const statusData = {
            vehicleId,
            status: "OFF",
            driverName,
            model,
            companyId,
            companyName,
            sessionId: session?.sessionId,
            timestamp: payload.timestamp,
          };

          emitToAuthorizedClients("vehicle-status", statusData, companyId);
          io.to(`vehicle-${vehicleId}`).emit("vehicle-stopped", statusData);
        }
      }

      // ---------- GPS Data ----------
      else if (messageType === "gps" && activeVehicles.has(vehicleId)) {
        const session = activeVehicles.get(vehicleId);

        const traj = new Trajectory({
          vehicleId,
          sessionId: session.sessionId,
          latitude: payload.latitude,
          longitude: payload.longitude,
        });

        await traj.save();
        resetHeartbeat(vehicleId);

        logger.info(
          "GPS",
          `${driverName} [${timestamp}] Lat:${payload.latitude.toFixed(4)}, Lng:${payload.longitude.toFixed(4)} [${companyName}]`
        );

        const gpsData = {
          vehicleId,
          sessionId: session.sessionId,
          driverName,
          model,
          companyId,
          companyName,
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp,
        };

        emitToAuthorizedClients("vehicle-gps", gpsData, companyId);
        io.to(`vehicle-${vehicleId}`).emit("gps-update", gpsData);
      }
    } catch (err) {
      logger.error("MQTT", `Message handling error: ${err.message}`);

      io.sockets.sockets.forEach((socket) => {
        if (socket.userData?.role === ALLOWED_ROLES.SUPER_ADMIN) {
          socket.emit("mqtt-error", {
            message: err.message,
            timestamp: new Date().toISOString(),
          });
        }
      });
    }
  });

  // ---------------- CONNECTION ERROR ----------------
  client.on("error", (err) => {
    logger.error("MQTT", `Connection error: ${err.message}`);
  });

  // ---------------- SHUTDOWN HANDLER ----------------
  process.on("SIGTERM", () => {
    logger.warn("MQTT", "SIGTERM received, shutting down...");
    heartbeatTimeouts.forEach((timeout) => clearTimeout(timeout));
    heartbeatTimeouts.clear();
    activeVehicles.clear();
    client.end();
    logger.info("MQTT", "All heartbeats cleared and client disconnected");
  });

  return client;
};