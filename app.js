const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const env = require('dotenv');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const validator = require('express-validator');
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
const resetRouter = require('./routes/reset')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error(err.message); // Log error message in our server's console
    res.status(500).json({ error: "Something went wrong" });
});

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
app.use('/reset', resetRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
// app.use('/activities', activitiesRouter); //này chưa hoàn thành nên tạm cmt (Dưa Hauz)
app.use('/projects', projectsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/blog', blogRouter);

const mongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(process.env.DB_CONNECT || 'mongodb://localhost:27017/admin', mongooseOption, (err) => {
    if(err)
        console.log(err)
    else
        console.log('connect to database')
})



//REDIRECT WRONG URL.
app.get('/warning/error', (req, res) => {
    res.status(400).send('Something wrong!');
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

    // send error status
    res.status(err.status || 500);
});

app.listen(3000,function(){
    console.log('app listen port 3000');
})

module.exports = app;
