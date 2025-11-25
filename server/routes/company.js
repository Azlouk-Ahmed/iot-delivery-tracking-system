const {addAdminToCompany, createCompany, getCompanyAdmins, getCompanyVehicles, removeAdminFromCompany, getAll} = require("../controllers/company");
const express = require("express");


const router = express.Router();

router.post(
  "/",
  createCompany
);


router.get(
  "/all",
  getAll
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
