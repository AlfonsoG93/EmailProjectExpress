const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');

require("dotenv").config();

require('./config/mongoose-setup');
require('./config/passport-setup');


const app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    //accept cookies across domains
    credentials: true,
    //Only allow these domains
    origin : ['http://localhost:4200']
  })
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes------------------------
const userApi = require("./routes/user-api-router");
app.use("/api", userApi);

const emailApi = require('./routes/email-api-router');
app.use('/api', emailApi);
//End Routes--------------------
module.exports = app;
