const mongoose = require('mongoose');

const trajectorySchema = new mongoose.Schema({
    vehicleId: { type: String, required: true },
    sessionId: { type: String, required: true }, 
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

trajectorySchema.index({ vehicleId: 1, timestamp: -1 });

module.exports = mongoose.model('Trajectory', trajectorySchema);