const express = require("express");
const router = express.Router({mergeParams: true});
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const {saveRedirectUrl} = require("../middleware.js")
const userControllers = require("../controller/user.js")


// Sign up
router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.signup));

// Login
router.route("/login")
.get( userControllers.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login',failureFlash:true}),wrapAsync(userControllers.Loging));


// Log out
router.get("/logout",userControllers.Logout)

module.exports = router;