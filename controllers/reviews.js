const Campground = require('../Models/campGrounds');
const Review = require('../Models/review');

module.exports.newReview = async (req,res) => {
    let {id} = req.params;
    const author = req.user._id;
    //console.log(id);
    let {rating, body} = req.body;
    const newReview = new Review({
        rating : rating,  
        body: body,
        author: author
    }) 
    let campground = await Campground.findById(id);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Succsessfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`);

}


module.exports.deleteReview = async (req,res) => {
    let {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succsessfully deleted a review!');
    return res.redirect(`/campgrounds/${id}`);
    
    
}