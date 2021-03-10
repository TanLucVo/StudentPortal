var express = require('express');
var router = express.Router();
const passport = require('passport');
const {
	ensureGuest
} = require('../middleware/auth')
const createError = require("http-errors");
const User = require('../models/user')
/* GET login page. */
router.get('/', ensureGuest, async function (req, res, next) {
	res.render('login', {
		title: 'Express',
		error: req.session.error || null
	});
	req.session.destroy();
});

// POST login page
// router.post('/', async function (req, res, next) {
// 	const username = req.body.username
// 	const password = req.body.password
// 	if (!username || !password) {
// 		return res.render('login', {
// 			error: "Username or password not empty"
// 		})
// 	} else {
// 		const user = await User.findOne({
// 			username: username,
// 			password: password
// 		})
// 		if (!user) {
// 			return res.render('login', {
// 				error: "Username or password is not correct"
// 			})
// 		}
// 	}
// });
// passport.authenticate('local-login', {
// 	successRedirect: '/',
// 	failureRedirect: '/auth',
// 	failureFlash: true,
// })
router.post('/',(req, res, next) => {
	passport.authenticate('local-login',{
			successRedirect: '/',
			failureRedirect: '/auth',
			failureFlash: true,
		}, function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.session.error = 'email is not valid';
			return res.redirect('/auth');
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/');
		});
	})(req, res, next);
});



//logout
router.get('/logout', function (req, res, next) {
	req.logOut()
	res.redirect('/')
});
//signin with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
router.get(
	'/google/callback',
	// passport.authenticate('google', {successRedirect:'/', failureRedirect: '/1231232',failureMessage:"email is not valid"}),
	(req, res, next) => {
		passport.authenticate('google', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.session.error = 'email is not valid';
				return res.redirect('/auth');
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.redirect('/');
			});
		})(req, res, next);
	}
)

// catch 404 and forward to error handler
router.use(function (req, res, next) {
	next(createError(404));
});

// error handler
router.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = router;