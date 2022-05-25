const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./config/passport')(passport);

// db config

const db = require('./config/keys').MongoURI;

// connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log('mongoDB connected...'))
    .catch(err => console.log(err))


// bodyparser
app.use(express.urlencoded({ extended: false })); //used when getting data from forms

// express session 
app.use(session({
    secret: 'doggo',
    resave: true,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const port = process.env.port || 5000;

app.listen(port, console.log(`server started on port ${port}`));
