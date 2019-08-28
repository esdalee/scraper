// Add Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

// Models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = 3000;

// Middleware
// Req body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// Connect to Mongodb
mongoose.connect("mongodb://localhost", { useNewUrlParser: true });

// Routes
// Retrieve data
app.get("/scrape", function(req, res){
    // Axios req to Buzzfeed
    axios.get("https://buzzfeed.com").then(function(response){
        var $ = cheerio.load(response.data);
            $(".title").each(function(i, element){

            })



    })
    db.Article.find({}, function(err, found) {
        // Error handling
        if(err) {
            console.log(err);
        }
        else {
            res.json(found);
        }

        // Message user
        res.send("Completed");
    });
});

// Scrape data and store to db
app.get("/articles", function(req, res){
    // Retrieve every document
    db.Article.find({}).then(function(dbArticle){
        // Send back articles
        res.json(dbArticle);
    }).catch(function(err){
        // Error handler, send to user
        res.json(err);
    })
});

// Start server
app.listen(3000, function(){
    console.log("Running on port" + PORT)
})
