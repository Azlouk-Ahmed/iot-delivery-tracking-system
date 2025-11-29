const Vehicle = require('../models/vehicle');
const User = require('../models/user');



exports.createVehicle = async (req, res) => {
  try {
    const { model, licensePlate, driverId, companyId } = req.body; 
    console.log("Create Vehicle Request Body:", companyId);

    
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({
        success: false,
        message: 'this user is not a valid driver'
      });
    }

    
    const vehicleCount = await Vehicle.countDocuments();
    const nextId = String(vehicleCount + 1).padStart(3, '0');
    const vehicleId = `VEHICLE_${nextId}`;

    
    const existingPlate = await Vehicle.findOne({ licensePlate });
    if (existingPlate) {
      return res.status(400).json({
        success: false,
        message: 'License plate already exists'
      });
    }

    const vehicle = new Vehicle({
      vehicleId, 
      model,
      licensePlate,
      companyId,
      driverId
    });

    await vehicle.save();
    await vehicle.populate('driverId', 'name email');

    res.status(201).json({
      success: true,
      message: `Vehicle ${vehicleId} created successfully`,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getAllVehicles = async (req, res) => {
  try {
    const { activeOnly, driverId } = req.query;
    let filter = {};

    if (activeOnly === 'true') filter.isActive = true;
    if (driverId) filter.driverId = driverId;

    const vehicles = await Vehicle.find(filter)
      .populate('driverId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAllVehiclesAdmin = async (req, res) => {
  try {

    const vehicles = await Vehicle.find({companyId: req.params.companyId})
      .populate('driverId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAll = async (req, res) => {
  try {

    const vehicles = await Vehicle.find()
      .populate('companyId').populate("driverId", "name email photo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({ vehicleId })
      .populate('driverId', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const updates = req.body;

    
    if (updates.driverId) {
      const driver = await User.findById(updates.driverId);
      if (!driver || driver.role !== 'driver') {
        return res.status(400).json({
          success: false,
          message: 'Invalid driver ID'
        });
      }
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('driverId', 'name email');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOneAndDelete({ vehicleId });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isActive } = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId },
      { isActive },
      { new: true }
    ).populate('driverId', 'name');

    res.status(200).json({
      success: true,
      message: `Vehicle ${isActive ? 'activated' : 'deactivated'}`,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};