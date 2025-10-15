const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
const authRouter = require("./routes/auth");
const vehicleRouter = require("./routes/vehicle");
const trajectoryRouter = require("./routes/trajectory");
const ALLOWED_ROLES = require("./config/roles-list");
const User = require("./models/user");
const Vehicle = require("./models/vehicle");
const Company = require("./models/company");
require("dotenv").config();
require("./config/google-auth-config");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});



app.set("io", io);

io.on("connection", async (socket) => {
  const { name, role, userId } = socket.handshake.auth;
  
  console.log(`Welcome back ${name} (${role})`);
  
  // Only allow super_admin and admin to connect
  if (role !== ALLOWED_ROLES.SUPER_ADMIN && role !== ALLOWED_ROLES.ADMIN) {
    console.log(`❌ Unauthorized role: ${role} - Connection rejected`);
    socket.emit("unauthorized", { 
      message: "Only administrators can access real-time tracking" 
    });
    socket.disconnect(true);
    return;
  }

  // Store user info on socket for later use
  socket.userData = { name, role, userId };

  // For admins, get their company ID
  if (role === ALLOWED_ROLES.ADMIN) {
    try {
      console.log(`Fetching company for admin ${userId}...`);
      const company = await Company.findOne({ admins: userId });
      if (!company) {
        console.log(`❌ Admin ${name} has no company - Connection rejected`);
        socket.emit("unauthorized", { 
          message: "Admin account not linked to a company" 
        });
        socket.disconnect(true);
        return;
      }
      socket.userData.companyId = company._id.toString();
      console.log(`✅ Admin ${name} connected - Company: ${company.name}`);
    } catch (error) {
      console.error(`❌ Error fetching admin data:`, error);
      socket.disconnect(true);
      return;
    }
  } else {
    console.log(`✅ Super Admin ${name} connected - Full access`);
  }

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id} (${name})`);
  });

  socket.on("join-vehicle", async (vehicleId) => {
    try {
      // Verify vehicle exists
      const vehicle = await Vehicle.findOne({ vehicleId }).populate('companyId');
      
      if (!vehicle) {
        socket.emit("error", { message: `Vehicle ${vehicleId} not found` });
        return;
      }

      // Super admin can join any vehicle
      if (socket.userData.role === ALLOWED_ROLES.SUPER_ADMIN) {
        socket.join(`vehicle-${vehicleId}`);
        console.log(`📡 Super Admin ${socket.id} joined room: vehicle-${vehicleId}`);
        socket.emit("joined-vehicle", { vehicleId, success: true });
        return;
      }

      // Admin can only join vehicles from their company
      if (socket.userData.role === ALLOWED_ROLES.ADMIN) {
        if (vehicle.companyId._id.toString() === socket.userData.companyId) {
          socket.join(`vehicle-${vehicleId}`);
          console.log(`📡 Admin ${socket.id} joined room: vehicle-${vehicleId}`);
          socket.emit("joined-vehicle", { vehicleId, success: true });
        } else {
          console.log(`⚠️ Admin ${socket.id} denied access to vehicle-${vehicleId} (different company)`);
          socket.emit("error", { 
            message: `Access denied: Vehicle belongs to another company` 
          });
        }
      }
    } catch (error) {
      console.error(`Error joining vehicle room:`, error);
      socket.emit("error", { message: "Failed to join vehicle room" });
    }
  });

  socket.on("leave-vehicle", (vehicleId) => {
    socket.leave(`vehicle-${vehicleId}`);
    console.log(`📡 Client ${socket.id} left room: vehicle-${vehicleId}`);
  });
});

require("./mqtt/mqttClient")(io);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use("/auth", limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRouter);
app.use("/trajectory", trajectoryRouter);
app.use("/vehicle", vehicleRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔌 Socket.IO ready on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  io.close(() => {
    console.log("Socket.IO connections closed");
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;