const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const moment = require('moment');
const helper = require('../helpers/search');
const emailHelper = require('../helpers/email');

exports.checkBookingAvilability = async (req, res) => {
  try {
    if (!req.body.date) {
      return res.status(200).send({
        appointmentCount: 0,
        success: true,
      });
    }
    const getDay = moment(req.body.date).format('YYYY-MM-DD');
    const startDay = moment(getDay + ' 00:00:00');
    const endDay = moment(getDay + ' 23:23:23');
    console.log('startDay', startDay, 'endDay', endDay);
    // const date = moment(req.body.date, 'YYYY-MM-DD').toISOString();

    const appointments = await Appointment.countDocuments({
      date: { $gte: startDay, $lte: endDay },
    });

    return res.status(200).send({
      appointmentCount: appointments,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error booking appointment',
      success: false,
      error,
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const search = helper.searchAppointment(req);
    if (!req.body.sort) {
      req.body.sort = { date: 'descending' };
    }
    const appointments = await Appointment.find(search).sort(req.body.sort);

    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error getting all appointments',
      success: false,
      error,
    });
  }
};

exports.getDoctorAppointmentsByUserId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.body.userId });
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    req.body.status = 'pending';
    req.body.date = new Date(req.body.date);
    // req.body.date = moment(req.body.date, 'YYYY-MM-DD').toISOString();
    console.log(req.body.date);
    // req.body.timeFrom = moment(req.body.timeFrom, 'HH:mm').toISOString();
    // req.body.timeTo = moment(req.body.timeTo, 'HH:mm').toISOString();
    req.body.doctorInfo = await User.findById(req.body.doctorId);
    req.body.schedulerId = req.body.userId;
    req.body.schedulerInfo = await User.findById(req.body.userId).select();
    req.body.userInfo = await User.findById(req.body.userId).select();
    delete req.body.userId;

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    console.log(req.body.doctorInfo.email);

    res.status(200).send({
      message: 'Appointment booked successfully',
      success: true,
    });

    try {
      const emailBody = `Hi ${req.body.doctorInfo.name}, <br> 
		<p>You have new appointment with patient named <b>${
      req.body.patient
    }</b>. Appointment date is <b> ${moment(req.body.date).format(
        'MMM Do YY'
      )} </b> and time is <b> ${moment(req.body.timeFrom, 'hh:mm A').toISOString()} - ${moment(
        req.body.timeTo,
        'hh:mm A'
      ).toISOString()}</b>.</p>
		`;
      await emailHelper.emailSend(
        'aca.vendor@gmail.com',
        req.body.doctorInfo.email,
        `New Appointment with ${req.body.patient}`,
        emailBody
      );

      console.log('email sent to: ' + req.body.doctorInfo.email);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error booking appointment',
      success: false,
      error,
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    req.body.status = 'pending';
    req.body.date = new Date(req.body.date);
    // req.body.date = moment(req.body.date, 'YYYY-MM-DD').toISOString();
    // req.body.timeFrom = moment(req.body.timeFrom, 'HH:mm').toISOString();
    // req.body.timeTo = moment(req.body.timeTo, 'HH:mm').toISOString();
    req.body.doctorInfo = await User.findById(req.body.doctorId);
    req.body.schedulerId = req.body.userId;
    req.body.schedulerInfo = await User.findById(req.body.userId).select();

    delete req.body.userId;

    await Appointment.findByIdAndUpdate(req.params.appointmentId, {
      ...req.body,
    });
    res.status(200).send({
      message: 'Appointment updated successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error updating appointment',
      success: false,
      error,
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.deleteOne({ _id: req.params.appointmentId });

    res.status(200).send({
      message: 'Appointment deleted successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error deleting appointment',
      success: false,
      error,
    });
  }
};
