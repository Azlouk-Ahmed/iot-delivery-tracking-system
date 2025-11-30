const { createDelivery, deleteDelivery, getAllDeliveries, getDeliveryById, updateDelivery, updateDeliveryStatus, getDeliveryStats, getAllDeliveriesCompany, getuserDeliveries } = require("../controllers/delivery");

const express = require("express");
const authorizeRoles = require("../middlewares/verifyRoles");
const ALLOWED_ROLES = require("../config/roles-list");
const { authenticateToken } = require("../middlewares/auth");


const router = express.Router();


router.post("/", createDelivery);
router.get("/stats", getDeliveryStats);


router.get("/", getAllDeliveries);
router.get("/all",authenticateToken,authorizeRoles([ALLOWED_ROLES.USER]), getuserDeliveries);
router.get("/company/:companyId", getAllDeliveriesCompany);
router.get("/admin",authenticateToken,authorizeRoles([ALLOWED_ROLES.ADMIN]), getAllDeliveries);


router.get("/:id", getDeliveryById);


router.put("/:id", updateDelivery);


router.patch("/:id/status", updateDeliveryStatus);


router.delete("/:id", deleteDelivery);

module.exports = router;
