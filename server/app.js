const express = require('express');
const app = express();
const morgan= require('morgan')
const axios = require('axios');

// // Connect  
// const mock = mockAdapter("axios");
// mock.onGet("http://omdbapi/.com/?i=" + movieData +"&apikey=8730e0e")
// .then (response => {});

// const movieData= [{}]
// ;
// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
/* GET home page. */

// This is our simple cache!
let cache = { };

const getDataFromCache = (key) => {
    let data = cache[key];
    return data;
}

app.get('/', (req, res) => {
    let movieId = req.query.i;
    let movieTitle = req.query.t; 
    let key = movieId || movieTitle;

    console.log("key", key);

    if (!movieId && !movieTitle) {
        // This is a bad request, because either movie id or movie title 
        // should be provided!
        return res.status(400).send("Please provide movie id or title");
    }

    // First check if we have them in the cache
    let data = getDataFromCache(key);
    
    if (data) {
        console.log("This is coming from our cache");
        // If it is return that information to the client
        return res.status(200).json(data);
    } 
    else {
        console.log("We need to get it from OMDB");
        // We don't have the data in our cache, so we really need to go to 
        // the OMDB to get the data that we need!
        let url;
        
        if (movieId) {
            // Get data using movie id
            url = `http://omdbapi.com/?i=${movieId}&apikey=8730e0e`;
        }
        else {
            // Get data using title
            url = `http://omdbapi.com/?t=${movieTitle}&apikey=8730e0e`;
        }

        console.log("url is ", url);

        axios.get(url)
            .then((response) => {
                let data = response.data;
                console.log ("so far so good")
                console.log("data", data);
                // Add the data to our cache with the proper key
                cache[key] = data;
                console.log ('almost there')
                res.json(data);
            })
            .catch(e => {
                console.log("Error happened");
                res.json("Error");
            }); 
    }
});


// Previous implementation
// app.get('/', function(req, res, next) {
//     var movieId = req.query.i;

//     if (movieId) {
//         // axios.get("http://omdbapi.com/?i=tt3896198&apikey=8730e0e").then((response) => {
//         //     res.send(response.data);
//         // })
//         // The following url1  url2 are the same!
//         let url1 = "http://omdbapi.com/?i=" + movieId + "&apikey=8730e0e";
//         let url2 = `http://omdbapi.com/?i=${movieId}&apikey=8730e0e`;

//         axios.get(url1).then((response) => {
//             res.send(response.data);
//         });
//     } else {
//         var movieTitle = req.query.t; 

//         if (movieTitle) {
//             // axios.get ("http;//omdbapi.com/?t" + movieTitle +"&apikey=8730e0e")
//             // .then(response => {
//             //     res.send(response.data)
//             // });
//             axios.get(`http;//omdbapi.com/?t=${movieTitle}&apikey=8730e0e`)
//             .then(response => {
//                 console.log ("response", response)
//                 res.send(response.data)
//             });
//         }
//         else {
//             res.send("No parameters provided!");
//         }
//     }
//});

app.get('/data', function(req,res) {
    res.json({hello: 'world'})
})

app.get('/contact', function(req,res) {
    res.send('pong');
})

module.exports = app;
