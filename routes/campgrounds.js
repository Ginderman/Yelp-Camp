const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/expressError');
const {campgroundSchema, reviewSchema} = require('../middleware/joiCampgroundSchema');
const {joiValdiateCampground, joiValdiateReview}= require('../utils/joiValidate');
const {isAuthor} = require('../utils/isAuthor');
const {isLoggedIn} = require('../utils/isLoggedIn');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary/cloudinary');
const upload = multer({storage})

const Campground = require('../Models/campGrounds');

router.route('/' )
    .get(catchAsync (campgrounds.index))
    .post(isLoggedIn, upload.array('image'), joiValdiateCampground, catchAsync(campgrounds.newcampground))

router.get('/new', isLoggedIn , catchAsync(campgrounds.new))

router.route('/:id')
    .get(catchAsync(campgrounds.lookUpCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), joiValdiateCampground,  catchAsync(campgrounds.campgroundEdit))
    .delete(isLoggedIn, isAuthor,  catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campgroundEditForm))





module.exports = router;