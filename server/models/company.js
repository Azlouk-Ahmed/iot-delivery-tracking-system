const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: String,
    city: String,
    latitude: Number,
    longitude: Number,
  },
  phone: String,

  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
