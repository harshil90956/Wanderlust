// const Joi = require('joi');

// module.exports.listingSchema = Joi.object({
//         listing : Joi.object({
//         title : Joi.string().required(),
//         description : Joi.string().required(), 
//         location : Joi.string().required(), 
//         country : Joi.string().required(),
//         price : Joi.number().required().min(0),
//         image : Joi.string().allow("" , null),
//     }).required()
// });


const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        image: Joi.object({
            url: Joi.string(),
            filename: Joi.string(),
        }),
        price: Joi.number(),
        location: Joi.string(),
        country: Joi.string(),
        reviews: Joi.array().items(Joi.string().hex()),
        owner: Joi.string().hex(),
        geometry: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).required(),
        }),
        category: Joi.string().valid(
            'Trending',
            'Rooms',
            'Iconic cities',
            'Mountains',
            'Castles',
            'Amazing pools',
            'Camping',
            'Farms',
            'Artic',
            'Beach',
            'Tiny homes'
        ).required(),
    }).required()
});



module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});
