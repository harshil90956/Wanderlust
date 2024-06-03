const express = require("express");
const router = express.Router();
const ListingController = require("../controller/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Index Route: List all listings
router.route("/")
    .get(wrapAsync(ListingController.index)) // Display all listings
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,wrapAsync(ListingController.createListing)); // Validate listing before creating

// New Route: Render form for creating a new listing
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Category Route: Display listings based on category
router.get("/category", wrapAsync(ListingController.category));

// Show Route: Display details of a specific listing
router.get("/:id", wrapAsync(ListingController.showListing));

// Edit Route: Render form for editing a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// Update Route: Update details of a specific listing
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing,wrapAsync(ListingController.updateListing)); // Validate listing before updating

// Delete Route: Delete a specific listing
router.delete("/:id", isLoggedIn, isOwner, ListingController.destroyListing);

module.exports = router;
