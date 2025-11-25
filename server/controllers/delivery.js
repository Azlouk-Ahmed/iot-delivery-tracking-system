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

const getDeliveryStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Revenue (sum of all delivered orders)
    const revenueResult = await Delivery.aggregate([
      {
        $match: {
          status: "delivered"
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] }
          }
        }
      }
    ]);

    // Revenue for current month
    const currentMonthRevenue = await Delivery.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] }
          }
        }
      }
    ]);

    // Revenue for last month
    const lastMonthRevenue = await Delivery.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] }
          }
        }
      }
    ]);

    // Calculate revenue trend
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const currentRevenue = currentMonthRevenue[0]?.totalRevenue || 0;
    const lastRevenue = lastMonthRevenue[0]?.totalRevenue || 0;
    
    const revenueTrend = lastRevenue > 0 
      ? (((currentRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1)
      : currentRevenue > 0 ? 100 : 0;

    // New Customers (users created this month)
    const newCustomersCount = await User.countDocuments({
      role: "user",
      createdAt: { $gte: startOfMonth }
    });

    const lastMonthCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const customerTrend = lastMonthCustomers > 0
      ? (((newCustomersCount - lastMonthCustomers) / lastMonthCustomers) * 100).toFixed(1)
      : newCustomersCount > 0 ? 100 : 0;

    // Active Deliveries (in-progress + pending)
    const activeDeliveries = await Delivery.countDocuments({
      status: { $in: ["pending", "in-progress"] }
    });

    const lastMonthActiveDeliveries = await Delivery.countDocuments({
      status: { $in: ["pending", "in-progress"] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const activeDeliveriesTrend = lastMonthActiveDeliveries > 0
      ? (((activeDeliveries - lastMonthActiveDeliveries) / lastMonthActiveDeliveries) * 100).toFixed(1)
      : activeDeliveries > 0 ? 100 : 0;

    // Success Rate (delivered / total orders)
    const totalOrders = await Delivery.countDocuments();
    const deliveredOrders = await Delivery.countDocuments({ status: "delivered" });
    const successRate = totalOrders > 0 
      ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
      : 0;

    const lastMonthTotalOrders = await Delivery.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const lastMonthDeliveredOrders = await Delivery.countDocuments({
      status: "delivered",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const lastMonthSuccessRate = lastMonthTotalOrders > 0
      ? ((lastMonthDeliveredOrders / lastMonthTotalOrders) * 100).toFixed(1)
      : 0;

    const successRateTrend = lastMonthSuccessRate > 0
      ? ((successRate - lastMonthSuccessRate)).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: {
          value: totalRevenue,
          trend: parseFloat(revenueTrend),
          currentMonth: currentRevenue
        },
        newCustomers: {
          value: newCustomersCount,
          trend: parseFloat(customerTrend),
          lastMonth: lastMonthCustomers
        },
        activeDeliveries: {
          value: activeDeliveries,
          trend: parseFloat(activeDeliveriesTrend),
          lastMonth: lastMonthActiveDeliveries
        },
        successRate: {
          value: parseFloat(successRate),
          trend: parseFloat(successRateTrend),
          lastMonth: parseFloat(lastMonthSuccessRate)
        }
      }
    });
  } catch (error) {
    console.error("Get delivery stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery statistics",
      error: error.message
    });
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus,
    getDeliveryStats
};
