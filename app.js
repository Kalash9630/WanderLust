const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

// Session configuration
app.use(session({
    secret: "wanderlustsecret",
    resave: false,
    saveUninitialized: true
}));

// Flash messages
app.use(flash());

// Making success messages available to EJS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
});

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




app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);

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