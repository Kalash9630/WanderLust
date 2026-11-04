const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const upload = require("../config/multer.js");

// validating listing schema
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index route
router.get("/", wrapAsync (listingController.index));

// NEW Route (to show new form)
router.get("/new", isLoggedIn, listingController.new);

// Create Route (for adding in backend)
router.post("/", isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.create));

// Read : Show route
router.get("/:id", wrapAsync(listingController.show));

// Edit Route (to edit the listing)
router.get("/:id/edit", isLoggedIn, wrapAsync (listingController.edit));

// Update Route (for saving the edited part in database)
router.put("/:id", isLoggedIn, upload.single("image"),validateListing, wrapAsync (listingController.update));

// Delete Route (for deleting a listing)
router.delete("/:id", isLoggedIn, wrapAsync (listingController.delete));

module.exports = router;