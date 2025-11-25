const { createDelivery, deleteDelivery, getAllDeliveries, getDeliveryById, updateDelivery, updateDeliveryStatus, getDeliveryStats } = require("../controllers/delivery");

const express = require("express");


const router = express.Router();


router.post("/", createDelivery);
router.get("/stats", getDeliveryStats);


router.get("/", getAllDeliveries);


router.get("/:id", getDeliveryById);


router.put("/:id", updateDelivery);


router.patch("/:id/status", updateDeliveryStatus);


router.delete("/:id", deleteDelivery);

module.exports = router;
