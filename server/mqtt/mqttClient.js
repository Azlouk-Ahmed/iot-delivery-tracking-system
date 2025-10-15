const mqtt = require("mqtt");
const Vehicle = require("../models/vehicle");
const Trajectory = require("../models/trajectory");
const Company = require("../models/company"); // Add this
const { randomUUID } = require('crypto');
const ALLOWED_ROLES = require("../config/roles-list");

module.exports = (io) => {
  const activeVehicles = new Map();
  const HEARTBEAT_TIMEOUT = 30000; 
  const heartbeatTimeouts = new Map(); 

  const brokerUrl = "mqtt://broker.hivemq.com";
  const options = {
    clientId: "backend_service_" + Math.random().toString(16).substr(2, 8),
    clean: true,
  };

  console.log("[MQTT] Connecting to broker...");

  const client = mqtt.connect(brokerUrl, options);

  // Helper function to emit data based on user roles
  const emitToAuthorizedClients = (eventName, data, companyId = null) => {
    // Get all connected sockets
    const sockets = io.sockets.sockets;
    
    sockets.forEach((socket) => {
      const userData = socket.userData;
      
      if (!userData) return; // Skip if no user data
      
      // Super admin gets everything
      if (userData.role === ALLOWED_ROLES.SUPER_ADMIN) {
        socket.emit(eventName, data);
        return;
      }
      
      if (userData.role === ALLOWED_ROLES.ADMIN && companyId) {
        if (userData.companyId === companyId.toString()) {
          socket.emit(eventName, data);
        }
      }
    });
  };

  const handleVehicleTimeout = async (vehicleId) => {
    const vehicle = await Vehicle.findOne({ vehicleId })
      .populate('driverId', 'name')
      .populate('companyId', 'name');
      
    if (!vehicle) return;

    const driverName = vehicle.driverId.name;
    const model = vehicle.model;
    const companyId = vehicle.companyId._id;
    const session = activeVehicles.get(vehicleId);

    activeVehicles.delete(vehicleId);
    clearTimeout(heartbeatTimeouts.get(vehicleId));
    heartbeatTimeouts.delete(vehicleId);

    console.log(`\n🚗⏰ ${driverName} TIMEOUT - Vehicle OFF (${model})\n`);

    const statusData = {
      vehicleId,
      status: "TIMEOUT",
      driverName,
      model,
      companyId,
      companyName: vehicle.companyId.name,
      sessionId: session?.sessionId,
      timestamp: new Date().toISOString(),
      reason: "No GPS updates for 30 seconds"
    };

    // Emit to authorized clients based on company
    emitToAuthorizedClients("vehicle-status", statusData, companyId);

    // Emit to vehicle-specific room (already filtered by join-vehicle)
    io.to(`vehicle-${vehicleId}`).emit("vehicle-stopped", {
      vehicleId,
      driverName,
      model,
      sessionId: session?.sessionId,
      timestamp: new Date().toISOString(),
      reason: "Timeout - No GPS updates"
    });
  };

  const startHeartbeat = (vehicleId) => {
    clearTimeout(heartbeatTimeouts.get(vehicleId));
    
    const timeout = setTimeout(() => {
      handleVehicleTimeout(vehicleId);
    }, HEARTBEAT_TIMEOUT);
    
    heartbeatTimeouts.set(vehicleId, timeout);
    console.log(`⏰ Heartbeat started for ${vehicleId} (${HEARTBEAT_TIMEOUT/1000}s)`);
  };

  const resetHeartbeat = (vehicleId) => {
    if (activeVehicles.has(vehicleId)) {
      clearTimeout(heartbeatTimeouts.get(vehicleId));
      startHeartbeat(vehicleId);
      console.log(`🔄 Heartbeat reset for ${vehicleId}`);
    }
  };

  client.on("connect", () => {
    console.log("[MQTT] ✅ Connected to broker");
    
    client.subscribe("vehicles/+/status", { qos: 1 }, (err) => {
      if (!err) console.log("✅ [MQTT] Subscribed: vehicles/+/status");
    });
    client.subscribe("vehicles/+/gps", { qos: 1 }, (err) => {
      if (!err) console.log("✅ [MQTT] Subscribed: vehicles/+/gps");
    });
  });

  client.on("message", async (topic, message) => {
    try {
      const topicParts = topic.toString().split('/');
      const vehicleId = topicParts[1];
      const messageType = topicParts[2];
      const payload = JSON.parse(message.toString());
      const timestamp = new Date(payload.timestamp).toLocaleTimeString();

      const vehicle = await Vehicle.findOne({ vehicleId })
        .populate('driverId', 'name')
        .populate('companyId', 'name');
        
      if (!vehicle) {
        console.log(`⚠️ Unknown vehicle: ${vehicleId}`);
        return;
      }
      
      const driverName = vehicle.driverId.name;
      const model = vehicle.model;
      const companyId = vehicle.companyId._id;
      const companyName = vehicle.companyId.name;

      if (messageType === 'status') {      
        if (payload.status === "ON") {
          const sessionId = randomUUID();
          activeVehicles.set(vehicleId, { 
            sessionId, 
            driverName, 
            model, 
            companyId: companyId.toString() 
          });
          
          startHeartbeat(vehicleId);
          
          console.log(`\n🚗✅ ${driverName} just turned on his vehicle (${vehicleId} - ${model}) [${companyName}]`);
          console.log(`   📡 Listening to ${driverName}'s GPS coordinates\n`);
          
          const statusData = {
            vehicleId,
            status: "ON",
            driverName,
            model,
            companyId,
            companyName,
            sessionId,
            timestamp: payload.timestamp
          };

          // Emit to authorized clients
          emitToAuthorizedClients("vehicle-status", statusData, companyId);
          
          // Emit to vehicle-specific room
          io.to(`vehicle-${vehicleId}`).emit("vehicle-started", {
            vehicleId,
            driverName,
            model,
            sessionId,
            timestamp: payload.timestamp
          });
        } else {
          const session = activeVehicles.get(vehicleId);
          
          activeVehicles.delete(vehicleId);
          clearTimeout(heartbeatTimeouts.get(vehicleId));
          heartbeatTimeouts.delete(vehicleId);
          
          console.log(`\n🚗❌ ${driverName} turned off his vehicle (${model}) [${companyName}]\n`);
          
          const statusData = {
            vehicleId,
            status: "OFF",
            driverName,
            model,
            companyId,
            companyName,
            sessionId: session?.sessionId,
            timestamp: payload.timestamp
          };

          // Emit to authorized clients
          emitToAuthorizedClients("vehicle-status", statusData, companyId);
          
          // Emit to vehicle-specific room
          io.to(`vehicle-${vehicleId}`).emit("vehicle-stopped", {
            vehicleId,
            driverName,
            model,
            sessionId: session?.sessionId,
            timestamp: payload.timestamp
          });
        }
      }
      else if (messageType === 'gps' && activeVehicles.has(vehicleId)) {
        const session = activeVehicles.get(vehicleId);
        const traj = new Trajectory({
          vehicleId,
          sessionId: session.sessionId,
          latitude: payload.latitude,
          longitude: payload.longitude
        });
        await traj.save();
        
        resetHeartbeat(vehicleId);
        
        console.log(`📡 GPS [${timestamp}] ${driverName}: Lat:${payload.latitude.toFixed(4)}, Lng:${payload.longitude.toFixed(4)} [${companyName}]`);
        
        const gpsData = {
          vehicleId,
          sessionId: session.sessionId,
          driverName,
          model,
          companyId,
          companyName,
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp
        };

        // Emit to authorized clients
        emitToAuthorizedClients("vehicle-gps", gpsData, companyId);
        
        // Emit to vehicle-specific room
        io.to(`vehicle-${vehicleId}`).emit("gps-update", {
          vehicleId,
          sessionId: session.sessionId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp
        });
      }
    } catch (err) {
      console.error("[MQTT] ❌ Error:", err.message);
      
      // Only emit errors to super admins
      const sockets = io.sockets.sockets;
      sockets.forEach((socket) => {
        if (socket.userData?.role === ALLOWED_ROLES.SUPER_ADMIN) {
          socket.emit("mqtt-error", {
            message: err.message,
            timestamp: new Date().toISOString()
          });
        }
      });
    }
  });

  client.on("error", (err) => {
    console.error("[MQTT] ❌ Connection error:", err.message);
  });

  process.on('SIGTERM', () => {
    console.log("[MQTT] Shutting down - clearing timeouts...");
    heartbeatTimeouts.forEach(timeout => clearTimeout(timeout));
    heartbeatTimeouts.clear();
    activeVehicles.clear();
    client.end();
  });

  return client;
};