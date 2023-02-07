exports.searchAppointment = (req) => {
  const search = {};
  if (req.body.patient) {
    // search.push({ patient: { $regex: req.body.patient, $options: 'i' } });
    search['patient'] = { $regex: req.body.patient, $options: 'i' };
  }
  if (req.body.status) {
    search['status'] = req.body.status;
  }
  if (req.body.date) {
    search['date'] = {
      $gte: new Date(req.body.date[0]),
      $lt: new Date(req.body.date[1]),
    };
  }

  return search.length > 0 ? { $and: [search] } : search;
};
