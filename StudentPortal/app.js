const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require('connect-flash');
const loginRouter = require("./routes/login");
const indexRouter = require("./routes/index");
const statusRouter = require("./routes/status");
const api = require("./routes/API");
const uploadImage = require('./api/upLoadImageAPI')
const departmentRouter = require("./routes/department");
require('dotenv').config()
const {ensureAuth, ensureGuest} = require('./middleware/auth')
const app = express();
const notificationRouter = require('./routes/notification')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require('multer')
//database
const mongoose = require('mongoose')

//session
const session = require('express-session')
var options = {
    etag: true,
    //maxAge: 3600000, //in ms i.e 1 hr in this case
    redirect: true,
    setHeaders: function (res, path, stat) {
      //any other header in response
      res.set({
          'x-timestamp': Date.now(),
          'joseph' : 'hi',
          'Cache-Control' : (path.includes('index.html')) ? 'no-store' : 'public, max-age=3600000'
        });
    }
}

app.use(
	session({
	  secret: 'keyboard cat',
	  resave: false,
		saveUninitialized: false,
	  cookie:{maxAge: 3600000}
	})
)


//passport
const passport = require('passport');
const notification = require("./models/notification");
// Passport config
require('./config/passport')(passport)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), options));
//upload-image
app.use('/upload-image', uploadImage)

app.use("/auth", loginRouter);
//api push thong bao
app.use('/api', api)



app.use(ensureAuth)
app.use("/status",statusRouter)
app.use("/",indexRouter);
app.use("/department", departmentRouter);
app.use("/notification",notificationRouter)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});


//connect db
mongoose.connect(process.env.DB_CONNECTION,
	{
		useNewUrlParser:true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});
module.exports = app;
