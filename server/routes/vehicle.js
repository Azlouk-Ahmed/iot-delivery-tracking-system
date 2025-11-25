const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle');


router.post('/', vehicleController.createVehicle);


router.get('/all', vehicleController.getAll);
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getVehicleById);


router.put('/:vehicleId', vehicleController.updateVehicle);


router.delete('/:vehicleId', vehicleController.deleteVehicle);


router.patch('/:vehicleId/status', vehicleController.updateVehicleStatus);

module.exports = router;