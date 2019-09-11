// Add Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var router1 = require("./routing/routing1");
var router2 = require("./routing/routing2");
mongoose.set('useFindAndModify', false);

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;
var mongodb_URI = process.env.MONGODB_URI || "mongodb://localhost/feedscraper";

// Require all models
var db = require("./models");

// Middleware

app.use("/api", router1);
app.use("/", router2);


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
// app.get("/",function(req,res){
//     res.send("hello");
// });

// html routes
// app.get("/", function (req, res) {
//     res.render("index");
// });

// app.get("/index", function (req, res) {
//     res.render("index");
// });

// // Scrape data
// app.get("/scrape", function(req, res){
//     console.log("scrape is called");
//     // Axios req to Buzzfeed
//     axios.get("https://www.buzzfeednews.com").then(function(response){

//         // Array of all articles
//         let articleArray = [];
        
//         // Grab html
//         const $ = cheerio.load(response.data);
//         $("article.newsblock-story-card").each(function(i, element){

//             //Headline
//             let headline = $(element).children("span.newsblock-story-card__info").children("h2").text();
//             // console.log(headline);

//             // Summary
//             let summary = $(element).children("span.newsblock-story-card__info").children("p").text();
//             // console.log(summary);

//             // URL
//             let url = $(element).children("span.newsblock-story-card__info").children("h2").children("a").attr("href");
//             // console.log(url);

//             // Image    
//             // let img = $(element).children("span.newsblock-story-card__image-link").children(".img-wireframe__image").children(".img-wireframe__image-container").children("img").attr("src");
//             // console.log(img);

//             // Object for each piece
//             let articlePiece = {
//                 headline,
//                 summary,
//                 url
//             }

//             // Add article to array
//             articleArray.push(articlePiece);
//         })

//         db.Article.create(articleArray).then(data => {
//             console.log(data)
//             res.status(200).json({ data });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err.message
//             });
//         })
//     });
// });

// // Get All Articles from db
// app.get("/list", function(req,res){
//     db.Article.find({}).sort({ _id: -1 }).limit(30).then(function(dbArticle) {
//         // console.log(dbArticle);
//             var hbsObj = {
//                 article: dbArticle
//             };
//             // Send back articles
//             res.render("list", hbsObj);
//     }).catch(err => 
//         console.log(err)
//     );
// });

// // Get Saved Articles from db
// app.get("/saved", function(req,res){
//     db.Article.find({saved: true}).limit(30).then(function(dbArticle) {
//         // console.log(dbArticle)
//         var hbsObj = {
//             article: dbArticle
//         };
//         // Send back saved articles
//             res.render("saved", hbsObj);
//     }).catch(function(err){
//         // Error handler
//         res.json(err);
//     })
// });

// // Post Route to Save Article
// app.post("/save/:id", function(req, res){
//     // Search article by id
//     db.Article.findOneAndUpdate({_id: req.params.id},  {saved: true}, {new: true}).then(function(dbArticle) {
//         // Redirect user to Saved Articles Pg
//         console.log(dbArticle);
//         res.redirect("/list");
//     }).catch(function(err){
//         // Error handler
//         res.json(err);
//     })
// });

// // Delete Route to Remove Article
// app.delete("/delete/:id", function(req, res){
//     // Search article by id
//     db.Article.findOneAndRemove({_id: req.params.id})
//     .then(function(dbArticle) {
//         // Redirect user to Saved Articles Pg
//         res.redirect("/saved");
//     }).catch(function(err){
//         // Error handler
//         res.json(err);
//     })
// });

// // Routes for Notes
// // Get route to return note of an article
// app.get("/saved/note/:id", function(req, res){
//     // Search article by id then attach notes
//     db.Note.findOne({_id: req.params.id})
//     .then(function(dbNote) {
//         // Redirect to page
//         res.json(dbNote);
//     }).catch(function(err){
//         // Error handler
//         res.json(err);
//     })
// })

// // Post route for creating/saving note
// app.post("/saved/note/create/:id", function(req, res){
//     // Create note
//     db.Note.create(req.body).then(function(dbNote){
//         // Find corresponding article and attach the note 
//         db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}}, {new: true});
//     }).then(function(note){
//         // Send back article with note
//         res.json(note);
//     }).catch(function(err){
//         // Error handler, send to user
//         res.json(err);
//     });
// });

// // Post route to delete note
// app.post("/saved/note/delete/:id", function (req,res){
// // If note found, delete
// db.Note.findOneAndRemove({_id: req.params.id})
// // display result
// .then(function(dbNote){
//     res.json(dbNote);
// }).catch(function(err){
//     // Error handler
//     res.json(err);
// })
// });

// require("./routing/routing1")(app);
// require("./routing/routing2")(app);

// Start server
app.listen(PORT, function(){
    console.log("Running on port" + PORT);
});
