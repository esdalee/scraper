// Add Dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Require all models
var db = require("./models");

// Middleware

// Use morgan logger to log requests
app.use(logger("dev"));
// Req body as JSON
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static("public"));

// Connect to Mongodb
mongoose.connect("mongodb://localhost/feedscraper", { useNewUrlParser: true });

// Routes
require("./routes/apiroutes")(app);

// Start server
app.listen(3000, function(){
    console.log("Running on port" + PORT);
});