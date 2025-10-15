const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle');

// 🟢 CREATE
router.post('/', vehicleController.createVehicle);

// 🔵 READ
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getVehicleById);

// 🟡 UPDATE
router.put('/:vehicleId', vehicleController.updateVehicle);

// 🔴 DELETE
router.delete('/:vehicleId', vehicleController.deleteVehicle);

// ⚡ STATUS
router.patch('/:vehicleId/status', vehicleController.updateVehicleStatus);

module.exports = router;