const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.category=async (req, res) =>  {
  
    try {
        let { category } = req.query;
       
        // Convert the search query to lowercase
        category = category.toLowerCase();
    
        // Perform a case-insensitive search by converting the category field in the database to lowercase as well
        const listings = await Listing.find({ category: { $regex: new RegExp('^' + category + '$', 'i') } }).exec();
        
        if (listings.length > 0) {
            // Render the category.ejs view with the fetched listings
            res.render('category.ejs', { listings: listings, category: category });
        } else {
            // No listings found, show flash message
            req.flash("error", "No listings available for this category.");
            // Redirect or render a different view, depending on your application flow
            res.redirect("/listings"); // Redirect to another page or render a different view
            // Or render a different view
            // res.render('no-listings.ejs');
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('Internal Server Error');
    }
    
}    
    

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
        })
        .populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested Does Not Exist");
        return res.redirect("/listings"); // Add return statement here
    }
    res.render("listings/show.ejs", { listing ,MAP_TOKEN: process.env.MAP_TOKEN });
};
module.exports.createListing = async (req, res, next) => {
    try {

        // Access properties using dot notation or object destructuring
        const selectedCategory = req.body.listing.category; // Using dot notation

        // Alternatively, you can use object destructuring
        const { category, location } = req.body.listing;

        const response = await geoCodingClient.forwardGeocode({
            query: location, // Use the destructured location variable
            limit: 1,
        }).send();

        const { path, filename } = req.file;
        const newListingData = {
            ...req.body.listing, // Spread the listing object
            owner: req.user._id,
            image: { url: path, filename },
            geometry: response.body.features[0].geometry
        };

        const newListing = new Listing(newListingData);
        const savedListing = await newListing.save();

        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing");
        res.redirect("/listings/new");
    }
};



module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing You Requested Does Not Exist");
        res.redirect("/listings");
    }

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_300/q_50");
    

    res.render("listings/edit.ejs", { listing ,originalUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  

   if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
     
        listing.image = {url,filename};
        await listing.save();
    }
   
    req.flash("success","Listing Was Updated");
    res.redirect(`/listings/${id}`);
};

// ListingController.js



module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the listing by ID and delete it
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (error) {
        // Handle errors
        console.error("Error deleting listing:", error);
        req.flash("error", "Failed to delete listing");
        res.redirect("/listings");
    }
};
