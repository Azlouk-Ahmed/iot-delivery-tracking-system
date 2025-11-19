const validator = require("validator");


const validateSignup = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];

  
  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  } else if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  
  if (!name) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};


const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  
  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  
  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};


const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};


const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;
  const errors = [];

  if (!token) {
    errors.push("Reset token is required");
  }

  if (!newPassword) {
    errors.push("New password is required");
  } else if (newPassword.length < 6) {
    errors.push("Password must be at least 6 characters long");
  } else if (newPassword.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};


const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = validator.escape(req.body[key]);
      }
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateEmail,
  validatePasswordReset,
  sanitizeInput,
};