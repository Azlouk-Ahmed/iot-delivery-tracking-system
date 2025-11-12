const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
const logger = require("./utils/logger");

const authRouter = require("./routes/auth");
const vehicleRouter = require("./routes/vehicle");
const trajectoryRouter = require("./routes/trajectory");
const ALLOWED_ROLES = require("./config/roles-list");
const User = require("./models/user");
const Vehicle = require("./models/vehicle");
const Company = require("./models/company");
const userRouter = require("./routes/userRoutes");

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

// ---------------- Socket.IO Logic ----------------
io.on("connection", async (socket) => {
  const { name, role, userId } = socket.handshake.auth;
  logger.info("Socket", `User connected: ${name} (${role})`);

  socket.userData = { name, role, userId };

  if (role === ALLOWED_ROLES.ADMIN) {
    try {
      logger.info("Socket", `Fetching company for admin ${userId}`);
      const company = await Company.findOne({ admins: userId });

      if (!company) {
        logger.warn("Socket", `Admin ${name} is not linked to any company`);
        socket.emit("unauthorized", { message: "Admin account not linked to a company" });
        socket.disconnect(true);
        return;
      }

      socket.userData.companyId = company._id.toString();
      logger.success("Socket", `Admin ${name} connected - Company: ${company.name}`);
    } catch (error) {
      logger.error("Socket", `Error fetching admin data: ${error.message}`);
      socket.disconnect(true);
      return;
    }
  } else {
    logger.success("Socket", `Super Admin ${name} connected with full access`);
  }

  socket.on("disconnect", () => {
    logger.warn("Socket", `Client disconnected: ${socket.id} (${name})`);
  });

  socket.on("join-vehicle", async (vehicleId) => {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId }).populate("companyId");
      if (!vehicle) {
        socket.emit("error", { message: `Vehicle ${vehicleId} not found` });
        logger.warn("Socket", `Vehicle not found: ${vehicleId}`);
        return;
      }

      // Super Admin
      if (socket.userData.role === ALLOWED_ROLES.SUPER_ADMIN) {
        socket.join(`vehicle-${vehicleId}`);
        logger.info("Socket", `Super Admin joined room: vehicle-${vehicleId}`);
        socket.emit("joined-vehicle", { vehicleId, success: true });
        return;
      }

      // Admin
      if (socket.userData.role === ALLOWED_ROLES.ADMIN) {
        if (vehicle.companyId._id.toString() === socket.userData.companyId) {
          socket.join(`vehicle-${vehicleId}`);
          logger.info("Socket", `Admin joined room: vehicle-${vehicleId}`);
          socket.emit("joined-vehicle", { vehicleId, success: true });
        } else {
          logger.warn("Socket", `Admin denied access to vehicle-${vehicleId} (different company)`);
          socket.emit("error", { message: "Access denied: Vehicle belongs to another company" });
        }
      }
    } catch (error) {
      logger.error("Socket", `Error joining vehicle room: ${error.message}`);
      socket.emit("error", { message: "Failed to join vehicle room" });
    }
  });

  socket.on("leave-vehicle", (vehicleId) => {
    socket.leave(`vehicle-${vehicleId}`);
    logger.info("Socket", `Client ${socket.id} left room: vehicle-${vehicleId}`);
  });
});

// ---------------- MQTT Client ----------------
require("./mqtt/mqttClient")(io);

// ---------------- Express Middleware ----------------
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

// ---------------- Routes ----------------
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
app.use("/api/users", userRouter);

// ---------------- 404 Handler ----------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  logger.error("Server", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ---------------- Database Connection ----------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.success("Database", "Connected to MongoDB");
    server.listen(PORT, () => {
      logger.success("Server", `Server running on port ${PORT}`);
      logger.info("Server", `Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info("Socket", `Socket.IO ready on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database", `Connection error: ${err.message}`);
    process.exit(1);
  });

// ---------------- Graceful Shutdown ----------------
process.on("SIGTERM", () => {
  logger.warn("Server", "SIGTERM received. Closing server gracefully...");
  io.close(() => {
    logger.info("Socket", "Socket.IO connections closed");
    mongoose.connection.close(() => {
      logger.info("Database", "MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;
