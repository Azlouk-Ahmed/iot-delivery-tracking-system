const {addAdminToCompany, createCompany, getCompanyAdmins, getCompanyById, getCompanyVehicles, removeAdminFromCompany} = require("../controllers/company");
const express = require("express");


const router = express.Router();

router.post(
  "/",
  createCompany
);


router.get(
  "/:companyId",
  getCompanyById
);

router.get(
  "/:companyId/admins",
  getCompanyAdmins
);


router.post(
  "/add-admin",
  addAdminToCompany
);

router.post(
  "/remove-admin",
  removeAdminFromCompany
);


router.get(
  "/vehicles",
  getCompanyVehicles
);

module.exports = router;
