const Listing = require("../models/listing");
const { Country, City } = require("country-state-city");

module.exports.index = async (req, res) => {
  const { minPrice, maxPrice, location } = req.query;

  const filter = {};

  // Minimum price filter
  if (minPrice) {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }

  // Maximum price filter
  if (maxPrice) {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }

  // Country or location filter
  if (location) {
    filter.$or = [{ country: location }, { location: location }];
  }

  const allListings = await Listing.find(filter);

  const countries = await Listing.distinct("country");
  const locations = await Listing.distinct("location");
  const noListingsFound = allListings.length === 0;

  const wishlist = req.user ? req.user.wishlist.map((id) => id.toString()) : [];

  res.render("./listings/index.ejs", {
    allListings,
    countries,
    locations,
    minPrice,
    maxPrice,
    selectedLocation: location,
    noListingsFound,
    wishlist,
  });
};

module.exports.new = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.create = async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  let newListing = new Listing({
    title: title,
    description: description,
    image: req.file ? req.file.path : undefined,
    price: price,
    location: location,
    country: country,
  });
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing added successfully!");
  // console.log("Image URL:", newListing.image); for testing the image was received or not
  res.redirect("/listings");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .populate("owner");

  let currUser = req.user || null;

  res.render("./listings/show.ejs", { listing, currUser });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
};

// Update listing
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country } = req.body;

  let updatedListing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
  });

  if (req.file) {
    updatedListing.image = req.file.path;
    await updatedListing.save();
  }

  req.flash("success", "Listing updated successfully!");

  // Determine redirect destination
  const redirectUrl = req.get("Referrer")?.includes("from=account")
    ? "/account/listings"
    : `/listings/${id}`;

  res.redirect(redirectUrl);
};

// Delete listing
module.exports.delete = async (req, res) => {
    let { id } = req.params;

    // Find and delete the listing
    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(deletedListing);

    req.flash("success", "Listing deleted successfully!");

    // Determine redirect destination
    const redirectUrl = req.get("Referrer")?.includes("/account/listings")
        ? "/account/listings"
        : "/listings";

    res.redirect(redirectUrl);
};

// Get all countries
module.exports.getCountries = (req, res) => {
  const countries = Country.getAllCountries();

  res.json(
    countries.map((country) => ({
      name: country.name,
      code: country.isoCode,
    })),
  );
};

// Get cities of selected country
module.exports.getCities = (req, res) => {
  const { countryCode } = req.params;

  const cities = City.getCitiesOfCountry(countryCode);

  res.json((cities || []).map((city) => city.name));
};

// Add or remove a listing from the user's wishlist
module.exports.toggleWishlist = async (req, res) => {
  const { id } = req.params;

  // Determine the page from which the request was submitted
  const redirectUrl = req.get("Referrer")?.includes("/account/wishlist")
    ? "/account/wishlist"
    : "/listings";

  // Find the listing
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect(redirectUrl);
  }

  // Check whether the listing is already in the wishlist
  const isInWishlist = req.user.wishlist.some(
    (listingId) => listingId.toString() === id,
  );

  if (isInWishlist) {
    // Remove listing from wishlist
    req.user.wishlist.pull(id);
    req.flash("success", "Listing removed from your wishlist successfully!");
  } else {
    // Add listing to wishlist
    req.user.wishlist.push(id);
    req.flash("success", "Listing added to your wishlist successfully!");
  }

  await req.user.save();

  // Return to the page where the action was performed
  res.redirect(redirectUrl);
};
