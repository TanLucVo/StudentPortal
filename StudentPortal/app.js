const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require('connect-flash');
const loginRouter = require("./routes/login");
const indexRouter = require("./routes/index");
const statusRouter = require("./routes/status");
const departmentRouter = require("./routes/department");
require('dotenv').config()
const {ensureAuth, ensureGuest} = require('./middleware/auth')
const app = express();
//database
const mongoose = require('mongoose')

//session
const session = require('express-session')
app.use(
	session({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: false,
	})
)



//passport
const passport = require('passport')
// Passport config
require('./config/passport')(passport)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", loginRouter);
app.use(ensureAuth)
app.use("/",indexRouter);
app.use("/department",departmentRouter);
app.use("/status",statusRouter)
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
