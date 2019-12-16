const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const env = require('dotenv');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv/config');
require('./config/passport');

//route
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const activitiesRouter = require('./routes/activities');
const projectsRouter = require('./routes/projects');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const blogRouter = require('./routes/blog');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: "passport",
    proxy: true,
    secret: process.env.TOKEN_SECRET || "thongdz",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/activities', activitiesRouter);
app.use('/projects', projectsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/blog', blogRouter);

const mongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_CONNECT || 'mongodb://localhost:27017/admin', mongooseOption, (err) => {
    if (err)
        console.log('Error MongoDB');
    console.log('Connected to my database');
});


//REDIRECT WRONG URL.
app.get('/warning/error', (req, res) => {
    res.send('something wrong!');
});
app.all('*', function (req, res) {
    res.redirect('/warning/error');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});

module.exports = app;
