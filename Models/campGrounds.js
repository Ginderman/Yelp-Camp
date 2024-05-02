const mongoose = require('mongoose');
const Review = require('./review');
const opts = { toJSON: { virtuals: true} };

const Schema = mongoose.Schema;

const ImageSchema = new Schema({ 
        url: String,
        filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/h_180,w_200')
});

const CampgroundSchema = new Schema({
    title:{
        type: String,    
    },
    images:[ImageSchema],

    price:{
        type: Number,
        
    },
    description: {
        type: String
    },
    location: {
        type: String,
    },
    geometry: {
      type:{
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true

      }
    },
    reviews: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`;
});


CampgroundSchema.post('findOneAndDelete', async function (campgrounds) {
    console.log("Campgrgounds Middleware POST Review Deletion!!")
    console.log(campgrounds);
  if (campgrounds){
    await Review.deleteMany({
        id:{
           $in: campgrounds.reviews 
        }
    })
  }
 })


module.exports = mongoose.model('Campground', CampgroundSchema)