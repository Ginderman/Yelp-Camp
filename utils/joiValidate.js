const {campgroundSchema, reviewSchema} = require('../middleware/joiCampgroundSchema');
const ExpressError = require('../utils/expressError');


module.exports.joiValdiateCampground = (req, res, next) => {
    let result = campgroundSchema.validate(req.body)
    console.log(result);
    if (result.error){
        throw new ExpressError(result.error, 406);
    }
    else{
        next();
    }
}
module.exports.joiValdiateReview = (req, res, next) => {
let result = reviewSchema.validate(req.body)
console.log(result);
if (result.error){
    throw new ExpressError(result.error, 406);
}
else{
    next();
    }
}