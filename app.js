// Environment Configuration
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// Required Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// App Initialization
const app = express();


// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
});




// Middleware Configuration
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


// Session Store Configuration
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECREAT,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

// Session Configuration
const sessionOptions = {
    store,
    secret: process.env.SECREAT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom Middleware
// Custom Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Make sure req.user is correctly populated
    next();
});

// Logging Middleware
app.use((req, res, next) => {
    // console.log(req.body);
    next();
});

// Route Handling
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoute);

// 404 Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error Handling
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Server Initialization
app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
