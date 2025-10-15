const mqtt = require("mqtt");
const Vehicle = require("../models/vehicle");
const Trajectory = require("../models/trajectory");
const { randomUUID } = require('crypto');

// Export a function that accepts io instance
module.exports = (io) => {
  // In-Memory Cache
  const activeVehicles = new Map();

  const brokerUrl = "mqtt://broker.hivemq.com";
  const options = {
    clientId: "backend_service_" + Math.random().toString(16).substr(2, 8),
    clean: true,
  };

  console.log("[MQTT] Connecting to broker...");

  const client = mqtt.connect(brokerUrl, options);

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

      const vehicle = await Vehicle.findOne({ vehicleId }).populate('driverId', 'name');
      if (!vehicle) {
        console.log(`⚠️ Unknown vehicle: ${vehicleId}`);
        return;
      }
      
      const driverName = vehicle.driverId.name;
      const model = vehicle.model;

      if (messageType === 'status') {      
        if (payload.status === "ON") {
          const sessionId = randomUUID();
          activeVehicles.set(vehicleId, { sessionId, driverName, model });
          console.log(`\n🚗✅ ${driverName} just turned on his vehicle (${vehicleId} - ${model})`);
          console.log(`   📡 Listening to ${driverName}'s GPS coordinates\n`);
          
          // Emit to all connected clients
          io.emit("vehicle-status", {
            vehicleId,
            status: "ON",
            driverName,
            model,
            sessionId,
            timestamp: payload.timestamp
          });
          
          // Emit to specific vehicle room
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
          console.log(`\n🚗❌ ${driverName} turned off his vehicle (${model})\n`);
          
          // Emit to all connected clients
          io.emit("vehicle-status", {
            vehicleId,
            status: "OFF",
            driverName,
            model,
            sessionId: session?.sessionId,
            timestamp: payload.timestamp
          });
          
          // Emit to specific vehicle room
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
        
        console.log(`📡 GPS [${timestamp}] ${driverName}: Lat:${payload.latitude.toFixed(4)}, Lng:${payload.longitude.toFixed(4)}`);
        
        // Emit GPS data to all clients
        io.emit("vehicle-gps", {
          vehicleId,
          sessionId: session.sessionId,
          driverName,
          model,
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp
        });
        
        // Emit to specific vehicle room
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
      
      // Emit error to clients
      io.emit("mqtt-error", {
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  client.on("error", (err) => {
    console.error("[MQTT] ❌ Connection error:", err.message);
  });

  return client;
};