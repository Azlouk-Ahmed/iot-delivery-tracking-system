const express = require('express');
const router = express.Router();
const trajectoryController = require('../controllers/trajectory');


router.post('/', trajectoryController.createTrajectory);


router.get('/', trajectoryController.getAllTrajectories);
router.get('/vehicle/:vehicleId', trajectoryController.getVehicleTrajectory);


router.put('/:id', trajectoryController.updateTrajectory);


router.delete('/:id', trajectoryController.deleteTrajectory);
router.delete('/vehicle/:vehicleId', trajectoryController.clearVehicleTrajectories);

module.exports = router;