const Campground = require('../Models/campGrounds');
const { cloudinary } = require('../cloudinary/cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding-v6');
const mapbox_access = process.env.MAPBOX_TOKEN;
const geoClient = mbxGeocoding({accessToken: mapbox_access});


module.exports.index = async (req, res) => {
    
    let campgrounds = await Campground.find({});
    if(!campgrounds){
        throw new ExpressError('No Campgrounds Found!', 400)
    }
    res.render('campgrounds/index', {campgrounds} );
}

module.exports.new = async (req, res) => {

    res.render('campgrounds/new');
}


module.exports.newcampground = async (req, res, next) => {
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    const {title, price, description, location } = req.body;
    const author = req.user._id.toString();
    const response = await geoClient.forwardGeocode({
        query: location,
        limit: 1
    })  
    .send()
    let newCampground = new Campground({
            title: title,
            price: price,
            description: description,
            location: location,
            geometry:response.body.features[0].geometry,
            images: images,
            author: author
        })
            
        await newCampground.save().then(()=>{console.log(newCampground)})
        req.flash('success', 'Succsessfully created a new campground!');
        res.redirect(`/campgrounds/${newCampground._id}`);        
}

module.exports.lookUpCampground = async (req, res) => {
    let {id} = req.params;
    let campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
        }).populate('author');
    if(!campground){
        throw new ExpressError('No Campground Found!', 410)
    }
    return res.render('campgrounds/specific', {campground});
}

module.exports.campgroundEditForm = async (req, res) => {
    let {id} = req.params;
    let campground = await Campground.findById(id);
    if(!campground){
        throw new ExpressError('No Campground Found to edit!', 410)
    }
    res.render('campgrounds/edit', {campground} );
}

module.exports.campgroundEdit = async (req,res) =>{
    const img = req.files.map(f => ({url: f.path, filename: f.filename}));
    let {id} = req.params;
    const { title, price, description, location} = req.body;
     let campground = await Campground.findByIdAndUpdate(id, {
        title: title,
        price: price,
        description: description,
        location: location,
     }, {new: true, runValidators : true});
     campground.images.push(...img);
     await campground.save();
     if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} }}})
        
     }
     
     req.flash('success', 'Succsessfully updated a campground!');
     res.redirect(`/campgrounds/${campground._id}`);
   
 }

 module.exports.deleteCampground = async (req, res) => {
    let {id} = req.params;
    let campground = await Campground.findById(id);
    if(campground.images){
        for(let image of campground.images){
         await cloudinary.uploader.destroy(image.filename);
        }
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succsessfully deleted a campground from database and cloudinary!');
    res.redirect('/campgrounds');
}

