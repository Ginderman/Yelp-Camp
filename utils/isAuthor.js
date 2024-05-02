
const Campground = require('../Models/campGrounds');
const Review = require('../Models/review');


module.exports.isAuthor = async(req,res,next) => {

        let {id} = req.params;

        let campground = await Campground.findById(id);
        if(campground.author._id.toString() !== req.user._id.toString()) {
            req.flash('error', "Campground is not owned by current user!");
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
}


module.exports.isReviewAuthor = async(req,res,next) => {

    let {id, reviewId} = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "Review is not owned by current user!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

