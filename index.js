if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();

}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./Models/user');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')
const port = process.env.PORT || 4000;

const database = process.env.MongoAtlasUrl


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


//mongoose.connect('mongodb://localhost:27017/yelp-camp')
mongoose.connect(database)


mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once('open', () => {
    console.log("Database connected");

});

let app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsmate);


app.use(bodyParser.urlencoded({ extended: false})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(methodOverride('_method'));//for using method override for requests to be able to post and delete
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const store = new MongoStore({
    mongoUrl: process.env.MongoAtlasUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: process.env.SECRET
        }
});

store.on('error', function(e) {
    console.log("SESSION STORE ERROR", e)
});


const sessionConfig = {
    name: 'MyCookie',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxage: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        //secure: true
     },
    store: store
    
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) =>{
    // console.log('         ');
    // console.log("URL:" + " " +  req.url);
    // console.log(req.session);
    // console.log("USER:" + " " +req.user);
    //console.log(req.query);

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/home', (req,res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const {statusCode = 500, message='Something Went Wrong'} = err;
    if(!err.message) {err.message = "Oh No, Something Went Wrong!"}
    req.flash('error', `The Error Encountered was ${err.message}  With a message code of ${err.statusCode}!`);
    res.status(statusCode).render('error', {err});
    console.log(err);
    
    
})






app.listen(port, ()=>{

    console.log(`Serving on port ${port}`);
})