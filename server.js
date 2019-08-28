// Add Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");

// Initialize Express
var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Mongojs configuration to db var
var db = mongojs(databaseUrl, collections);
db.on("error", function(error){
    console.log(error);
});

// Retrieve data
app.get("/news", function(req, res){
    db.scrapedData.find({}, function(err, found) {
        // Error handling
        if(err) {
            console.log(err);
        }
        else {
            res.json(found);
        }
    });
});

// Scrape data and store to db
app.get("/scrape", function(req, res){
    // Axios req to Buzzfeed
    axios.get("https://www.buzzfeed.com").then(function(response){
    // Load html to cheerio    
    var $ = cheerio.load(response.data);
        $(".title").each(function(i, element){
            
        })
    })
})


// Listen on port 3000
app.listen(3000, function(){
    console.log("Running on port 3000!")
})
