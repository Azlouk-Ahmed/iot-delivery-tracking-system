const Company = require("../models/company");
const User = require("../models/user");

const createCompany = async (req, res) => {
  try {
    const { name, location, phone, admins } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    if (admins && admins.length > 0) {
      const existingAdmins = await User.find({
        _id: { $in: admins },
        role: { $in: ["admin"] },
      });
      if (existingAdmins.length !== admins.length) {
        return res
          .status(400)
          .json({
            message: "Some admin IDs do not exist or are not authorized",
          });
      }
    }

    const company = new Company({
      name,
      location,
      phone,
      admins,
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyVehicles = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const vehicles = await Vehicle.find({ companyId }).populate("driverId");
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyAdmins = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId).populate("admins");
    res.status(200).json(company.admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAdminToCompany = async (req, res) => {
  try {
    const { companyId, adminId } = req.body;
    const adminExists = await User.findOne({
      _id: adminId,
      role: { $in: ["super_admin", "admin"] },
    });
    if (!adminExists) {
      return res
        .status(400)
        .json({ message: "Admin ID does not exist or is not authorized" });
    }
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { admins: adminId } },
      { new: true }
    ).populate("admins");
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeAdminFromCompany = async (req, res) => {
  try {
    const { companyId, adminId } = req.body;
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $pull: { admins: adminId } },
      { new: true }
    ).populate("admins");
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId).populate(
      "admins"
    );
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const company = await Company.find({}).populate(
      "admins"
    );
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanyVehicles,
  getCompanyAdmins,
  addAdminToCompany,
  removeAdminFromCompany,
  getAll,
};
