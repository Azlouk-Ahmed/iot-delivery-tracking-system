const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",      
        "in-progress",  
        "delivered",    
        "cancelled",     
        "failed",       
      ],
      default: "pending",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  }
  ,
  
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
