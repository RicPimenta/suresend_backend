const adminService = require("../services/admin.service");

exports.createAdmin = async (req, res) => {
  try {
    const { admin, plainPassword } = await adminService.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        password: plainPassword,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { admin, token } = await adminService.loginAdmin(
      req.body.email,
      req.body.password
    );
    res.status(200).json({
      success: true,
      message: admin.isFirstLogin
        ? "First login - password change required"
        : "Login successful",
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        isFirstLogin: admin.isFirstLogin,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res
      .status(400)
      .json({ success: false, message: "Email and newPassword are required" });

  try {
    const { admin, token } = await adminService.changePassword(
      email,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        isFirstLogin: admin.isFirstLogin,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
