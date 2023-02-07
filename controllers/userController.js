const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res.status(200).send({ message: 'User created successfully', success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error creating user', success: false, error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: 'User does not exist', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Password is incorrect', success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.status(200).send({ message: 'Login successful', success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error logging in', success: false, error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: 'Users fetched successfully',
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
};

exports.getUserInfoById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: 'User does not exist', success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error getting user info', success: false, error });
  }
};

//getAllDoctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ type: 'doctor' });
    res.status(200).send({
      message: 'Doctors fetched successfully',
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
};

//changeDoctorAccountStatus
exports.changeDoctorAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await User.findByIdAndUpdate(doctorId, {
      status,
    });

    res.status(200).send({
      message: 'Doctor status updated successfully',
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
};
