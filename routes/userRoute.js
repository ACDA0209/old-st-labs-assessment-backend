const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/register').post(userController.register);

router.route('/login').post(userController.login);
router.route('/get-all-users').get(authMiddleware, userController.getAllUsers);
router.route('/get-user-info-by-id').post(authMiddleware, userController.getUserInfoById);

router.route('/get-all-doctors').post(authMiddleware, userController.getAllDoctors);
router
  .route('/change-doctor-account-status')
  .post(authMiddleware, userController.changeDoctorAccountStatus);

module.exports = router;
