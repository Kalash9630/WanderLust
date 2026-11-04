const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.new = (req,res) => {
    res.render("./listings/new.ejs");
}

module.exports.create =async (req,res) => {
    let {title, description, image, price, location, country} = req.body;
    let newListing = new Listing({
        title : title,
        description : description,
        image : image || undefined,
        price : price,
        location : location,
        country : country,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added successfully!");
    // console.log("Image URL:", newListing.image); for testing the image was received or not
    res.redirect("/listings");
}

module.exports.show = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
            model: "User"
        }
    })
    .populate("owner");
    let currUser = req.user || null;
    res.render("./listings/show.ejs",{listing, currUser});
}

module.exports.edit = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}

module.exports.update = async (req,res) => {
    let {id} = req.params;
    let {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country,
    });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}