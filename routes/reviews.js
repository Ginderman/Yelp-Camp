const express = require('express');
const router = express.Router({mergeParams: true});
const  catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/expressError');
const {campgroundSchema, reviewSchema} = require('../middleware/joiCampgroundSchema');
const {joiValdiateReview}= require('../utils/joiValidate')
const {isLoggedIn} = require('../utils/isLoggedIn');
const {isReviewAuthor} = require('../utils/isAuthor');
const reviews = require('../controllers/reviews');
const Campground = require('../Models/campGrounds');
const Review = require('../Models/review')

router.post('/', isLoggedIn, joiValdiateReview, catchAsync (reviews.newReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview))

module.exports = router;