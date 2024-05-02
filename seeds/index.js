const mongoose = require('mongoose');
const Campground = require('../Models/campGrounds');
const express = require('express');
const cities = require("./cities");
const seedHelper = require("./seedHelpers");




mongoose.connect('mongodb://localhost:27017/yelp-camp')


mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once('open', () => {
    console.log("Database connected");

});

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let x = 0; x < 200; ++x){
        const random1000 = Math.floor(Math.random() * 1000);
        const random18 = Math.floor(Math.random() * seedHelper.descriptors.length);
        const random22 = Math.floor(Math.random() * seedHelper.places.length);
        
        //console.log (randPict.data);
        const newTestCampground = new Campground({
            title: `${sample(seedHelper.descriptors)} ${sample(seedHelper.places)}`,
            price: random1000,
            description: "Test Description",
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            images: [
                {
                  url: 'https://res.cloudinary.com/djg7dynfh/image/upload/v1712694124/YelpCamp/c9bpkipdrkoktzjvk5tw.jpg',
                  filename: 'YelpCamp/c9bpkipdrkoktzjvk5tw',
                  
                },
                {
                  url: 'https://res.cloudinary.com/djg7dynfh/image/upload/v1712694124/YelpCamp/fwpqkjdgqzdytii4qa0c.jpg',
                  filename: 'YelpCamp/fwpqkjdgqzdytii4qa0c',
                  
                }
              ],
            geometry: {
              type: 'Point', 
              coordinates: [ `${cities[random1000].longitude}`,  `${cities[random1000].latitude}`]
            },
            author: '660721dd275dff4edd94deab'
        });
        await newTestCampground.save();
    }
    console.log('Finished Seeding Database With Test Camps.')
}

seedDB().then(()=> {
    mongoose.connection.close();
})

