const express = require("express");
const app = express();
const middlewareLogger = require('logger_middleware_v2');
const pool = require('./config/db');
const mongoose = require('./config/mongodb');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.route');
const referralRouter = require('./routes/referalCode.route');
const contactUsRouter = require('./routes/contactUs.route');
const currencyRatesRouter = require('./routes/rates.route');


app.use(express.json()); // Parses JSON payloads
app.use(express.urlencoded({ extended: true })); 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(middlewareLogger);

app.use('/auth', authRouter);
app.use('/referral', referralRouter);
app.use('/contactUs', contactUsRouter);
app.use('/currencyRates', currencyRatesRouter);

app.get("/", (req, res) => {
  res.send("Hello, Sure Send");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
