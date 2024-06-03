const Listing = require("./models/listing.js");
const {listingSchema} = require('./schema.js'); 
const { reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");




module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged In");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of listing!");
        return res.redirect(`/listings/${id}`);  
    }
    next()
}
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.error("Validation Error:", error);
        const errmsg = error.details.map(el => el.message).join(',');
        return res.status(400).send(errmsg); // Add return statement here
    }
    next();
};

  module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        res.status(400).send(errmsg); // Sending 400 Bad Request
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    const { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of review!");
        return res.redirect(`/listings/${id}`);  
    }
    next()
}