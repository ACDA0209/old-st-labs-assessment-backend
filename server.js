const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
// const { connect } = require('./config/inMemDb');

app.use(express.json());
const userRoute = require('./routes/userRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const path = require('path');

app.use('/api/user', userRoute);
app.use('/api/appointment', appointmentRoute);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));
// app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));

connect()
  .then(() => {
    try {
      app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
    } catch (error) {
      console.log(`err ${err}`);
    }
  })
  .catch((err) => {
    console.log(`err ${err}`);
  });
