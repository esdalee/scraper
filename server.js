// Add Dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
// var xyz = require("./routes/apiroutes");

// Initialize Express
var app = express();
var PORT = 3000;

// Models
var db = require("./models");

// Routes
require("./routes/apiroutes")(app);

// Middleware
// Req body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// Connect to Mongodb
mongoose.connect("mongodb://localhost/feedscraper", { useNewUrlParser: true });

// Start server
app.listen(3000, function(){
    console.log("Running on port" + PORT)
})
