const Trajectory = require('../models/trajectory');
const Vehicle = require('../models/vehicle');

// 🟢 CREATE - Add GPS Point (For MQTT)
exports.createTrajectory = async (req, res) => {
  try {
    const { vehicleId, sessionId, latitude, longitude } = req.body;

    // Validate vehicle exists
    const vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const trajectory = new Trajectory({
      vehicleId,
      sessionId,
      latitude,
      longitude
    });

    await trajectory.save();

    res.status(201).json({
      success: true,
      message: 'GPS point saved',
      data: trajectory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔵 READ - Get All Trajectories
exports.getAllTrajectories = async (req, res) => {
  try {
    const { vehicleId, sessionId, startDate, endDate } = req.query;
    let filter = {};

    if (vehicleId) filter.vehicleId = vehicleId;
    if (sessionId) filter.sessionId = sessionId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const trajectories = await Trajectory.find(filter)
      .sort({ timestamp: 1 }) // Chronological order
      .limit(1000);

    res.status(200).json({
      success: true,
      count: trajectories.length,
      data: trajectories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔵 READ - Get Vehicle Trajectory (With Driver Info)
exports.getVehicleTrajectory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { sessionId, limit = 100 } = req.query;

    let filter = { vehicleId };
    if (sessionId) filter.sessionId = sessionId;

    const trajectories = await Trajectory.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Get vehicle + driver info
    const vehicle = await Vehicle.findOne({ vehicleId })
      .populate('driverId', 'name email');

    res.status(200).json({
      success: true,
      vehicle: vehicle,
      count: trajectories.length,
      data: trajectories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟡 UPDATE - Update GPS Point
exports.updateTrajectory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trajectory = await Trajectory.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!trajectory) {
      return res.status(404).json({
        success: false,
        message: 'Trajectory not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trajectory updated',
      data: trajectory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔴 DELETE - Delete Trajectory
exports.deleteTrajectory = async (req, res) => {
  try {
    const { id } = req.params;

    const trajectory = await Trajectory.findByIdAndDelete(id);
    if (!trajectory) {
      return res.status(404).json({
        success: false,
        message: 'Trajectory not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trajectory deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🗑️ DELETE - Clear Vehicle Trajectories
exports.clearVehicleTrajectories = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const result = await Trajectory.deleteMany({ vehicleId });
    
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} trajectory points`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};