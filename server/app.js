// Include the required libraries.
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const passport = require('passport');

const io = require('socket.io')();
const socketEvents = require('./socket/events');

// DB Config
const db = require("./config/keys").mongoURI;
// Passport config
require("./config/passport")(passport);
// Pull in our api routes
const router = require('./routes/router');

// Initialize a new ExpressJS application
const app = express();

// Connect to MongoDB
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Apply middleware functions
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

// Attach socket events
io.attach(app.listen());
socketEvents(io);

// Import routes to be served
router(app);

module.exports = app;
