const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      required: true,
    },
    schedulerId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    schedulerInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeFrom: {
      type: String,
      required: true,
    },
    timeTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = appointmentModel;
