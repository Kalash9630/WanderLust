if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// storing map token for accesing in ejs files
app.use((req, res, next) => {
    res.locals.mapToken = process.env.MAP_TOKEN;
    next();
});

// Session configuration
app.use(session(sessionOptions));

// Flash messages
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

// Making success messages available to EJS
app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// used to authenticate user for passport local strategy
passport.use(new LocalStrategy(User.authenticate()));

// storing user related info in session
passport.serializeUser(User.serializeUser());

// unstoring user related info in session
passport.deserializeUser(User.deserializeUser());

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB wanderlust.");
    })
    .catch((err) => {
        console.log(`Error while connecting Database wanderlust - ${err}`);
    })

// root page
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// })

// listing router
app.use("/listings",listingRouter);

// review router
app.use("/listings/:id/reviews",reviewRouter);

// user router
app.use("/",userRouter);

// handling if any other page is requested other than the one that are created
app.all("/{*splat}", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Error-handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err});
});

// Checking the server is started
const port = 8080;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}.`);
})