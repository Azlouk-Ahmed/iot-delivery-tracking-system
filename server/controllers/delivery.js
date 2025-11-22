const Delivery = require("../models/delivery");

 const createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      delivery,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("user", "name email")
      .populate("company", "name")
      .populate("vehicleId", "plateNumber")
      .populate("products.product", "name price");

    res.status(200).json({ success: true, count: deliveries.length, deliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("user", "name email")
      .populate("company", "name")
      .populate("vehicleId", "plateNumber")
      .populate("products.product", "name price");

    if (!delivery)
      return res.status(404).json({ success: false, message: "Delivery not found" });

    res.status(200).json({ success: true, delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 const updateDelivery = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDelivery)
      return res.status(404).json({ success: false, message: "Delivery not found" });

    res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


 const deleteDelivery = async (req, res) => {
  try {
    const deleted = await Delivery.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Delivery not found" });

    res.status(200).json({ success: true, message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ success: false, message: "Status is required" });

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery)
      return res.status(404).json({ success: false, message: "Delivery not found" });

    delivery.status = status;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: `Delivery status updated to '${status}'`,
      delivery,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus,
};
