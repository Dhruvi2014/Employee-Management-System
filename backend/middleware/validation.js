/**
 * Employee validation middleware
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const validateMobile = (mobile) => {
  // Allows optional '+' followed by digits, spaces, and dashes, total 7-15 digits
  const cleaned = String(mobile).replace(/[\s\-\(\)]/g, '');
  const mobileRegex = /^\+?[0-9]{7,15}$/;
  return mobileRegex.test(cleaned);
};

const validateEmployee = (req, res, next) => {
  const { name, email, mobile, department, designation } = req.body;
  const errors = {};

  // Name validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Employee name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Employee name must be at least 2 characters.';
  } else if (name.trim().length > 100) {
    errors.name = 'Employee name cannot exceed 100 characters.';
  }

  // Email validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  } else if (email.trim().length > 150) {
    errors.email = 'Email cannot exceed 150 characters.';
  }

  // Mobile validation
  if (!mobile || typeof mobile !== 'string' || !mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!validateMobile(mobile.trim())) {
    errors.mobile = 'Please provide a valid mobile number (e.g., +91 9876543210 or 9876543210).';
  }

  // Department validation
  if (!department || typeof department !== 'string' || !department.trim()) {
    errors.department = 'Department is required.';
  } else if (department.trim().length > 100) {
    errors.department = 'Department name cannot exceed 100 characters.';
  }

  // Designation validation
  if (!designation || typeof designation !== 'string' || !designation.trim()) {
    errors.designation = 'Designation is required.';
  } else if (designation.trim().length > 100) {
    errors.designation = 'Designation cannot exceed 100 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the errors in the form.',
      errors,
    });
  }

  next();
};

module.exports = {
  validateEmployee,
};
