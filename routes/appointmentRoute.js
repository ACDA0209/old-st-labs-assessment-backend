const express = require('express');
const appointmentController = require('./../controllers/appointmentController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/check-booking-avilability').post(appointmentController.checkBookingAvilability);

router
  .route('/get-all-appointments')
  .post(authMiddleware, appointmentController.getAllAppointments);

router
  .route('/get-doctor-appointments-by-user-id')
  .get(authMiddleware, appointmentController.getDoctorAppointmentsByUserId);

router.route('/book-appointment').post(authMiddleware, appointmentController.bookAppointment);

router
  .route('/update-appointment/:appointmentId')
  .patch(authMiddleware, appointmentController.updateAppointment);

router
  .route('/delete-appointment/:appointmentId')
  .delete(authMiddleware, appointmentController.deleteAppointment);

module.exports = router;
