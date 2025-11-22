const Trajectory = require('../models/trajectory');
const Vehicle = require('../models/vehicle');


exports.createTrajectory = async (req, res) => {
  try {
    const { vehicleId, sessionId, latitude, longitude } = req.body;

    
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
      .sort({ timestamp: 1 }) 
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

exports.getAllSessionsTrajectories = async (req, res) => {
  try {
    // Group trajectories from ALL vehicles by sessionId
    const sessions = await Trajectory.aggregate([
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: {
            vehicleId: "$vehicleId",
            sessionId: "$sessionId"
          },
          points: {
            $push: {
              latitude: "$latitude",
              longitude: "$longitude",
              timestamp: "$timestamp"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          vehicleId: "$_id.vehicleId",
          sessionId: "$_id.sessionId",
          points: 1
        }
      }
    ]);

    // Get all distinct vehicleIds for population
    const vehicleIds = [...new Set(sessions.map(s => s.vehicleId))];
    const vehicles = await Vehicle.find({ vehicleId: { $in: vehicleIds } })
      .populate('driverId', 'name email photo').populate('companyId', 'name');

    // Attach vehicle info to each session
    const enrichedSessions = sessions.map(session => {
      const vehicle = vehicles.find(v => v.vehicleId === session.vehicleId);
      return {
        vehicle,
        sessionId: session.sessionId,
        points: session.points
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedSessions.length,
      sessions: enrichedSessions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



exports.getVehicleTrajectory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { sessionId, limit = 100 } = req.query;

    let filter = { vehicleId };
    if (sessionId) filter.sessionId = sessionId;

    const trajectories = await Trajectory.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    
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