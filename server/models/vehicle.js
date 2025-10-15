const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleId: { type: String, required: true, unique: true },
    model: { type: String, required: true }, 
    licensePlate: { type: String, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
    isActive: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model('Vehicle', vehicleSchema);