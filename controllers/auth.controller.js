const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    let { name, password, email, cell, address } = req.body;

    const oldUser = await authModel.checkExisitingUser(email);

    if (oldUser) {
      return res.status(400).json({
        success: false,
        data: "User already exists",
      });
    }

    let encryptionPassword = await bcrypt.hash(password, 10);
    console.log(encryptionPassword);
    let UserData = {
      name: name,
      email: email,
      password: encryptionPassword,
      cell: cell,
      address: address,
    };

    const userResponse = await authModel.createUser(UserData);

    const user = await authModel.findOneEmail(email);

    let token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY
    );
    console.log(token);

    let objWithToken = { user, token };

    res.status(201).json({
      success: true,
      data: objWithToken,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await authModel.checkExisitingUser(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User does not exist",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        data: "Invalid password",
      });
    }

    let token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
