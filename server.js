// Add Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;
var mongodb_URI = process.env.MONGODB_URI || "mongodb://localhost/feedscraper";

// Require all models
// var db = require("./models");

// Middleware

// Use morgan logger to log requests
app.use(logger("dev"));
// Req body as JSON
app.use(express.urlencoded({ 
    extended: false}));
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongodb
mongoose.connect(mongodb_URI, { useNewUrlParser: true });

// Routes
require("./routing/routing1")(app);
require("./routing/routing2")(app);

// Start server
app.listen(PORT, function(){
    console.log("Running on port" + PORT);
});
