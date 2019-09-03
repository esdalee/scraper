// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
// var Article = require("../models/Article");
var db = require("../models");

module.exports = function(app) {
    // Scrape & store data
    app.get("/scrape", function(req, res){
        console.log("scrape is called");
        // Axios req to Buzzfeed
        axios.get("https://www.buzzfeednews.com").then(function(response){

            // Array of all articles
            let articleArray = [];
            
            // Grab html
            const $ = cheerio.load(response.data);
                $("article.newsblock-story-card").each(function(i, element){

                    //Headline
                    let headline = $(element).children("span.newsblock-story-card__info").children("h2").text();
                    console.log(headline);

                    // Summary
                    let summary = $(element).children("span.newsblock-story-card__info").children("p").text();
                    console.log(summary);

                    // URL
                    let url = $(element).children("span.newsblock-story-card__info").children("h2").children("a").attr("href");
                    console.log(url);

                    // Image    
                    let img = $(element).children("span.newsblock-story-card__info").children(".img-wireframe__image-container").children("img").attr("src");
                    console.log(img);

                    // Object for each piece
                    let articlePiece = {
                        headline,
                        summary,
                        url,
                        img
                    }

                    // Add article to array
                    articleArray.push(articlePiece);
                })

            db.Article.create(articleArray).then(data => {
                console.log(data)
                res.status(200).json({ data });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "error occured!"
                });
            })
        });
    });

    // Retrieve all stored Articles from db
    app.get("/list", function(req,res){
        db.Article.find({"saved": true}).populate("notes").exec(function(err, dbArticle) {
            // If error, send to user
            if(err) {
                res.json(err);
            }
            // If no error, send articles to user
            else {
                var hbsObj = {
                    article: articles
                };
                res.render("saved", hbsObj);
            }
            // Message user
            res.send("Completed");
        });
    })

    // Get route to attach note to article by id
    app.get("/list/:id", function(req, res){
        // Search article by id then attach notes
        db.Article.findOne({_id: req.params.id}).populate("note")
        .then(function(dbArticle){
            // Send article/note to user 
            res.json(dbArticle);
        }).catch(function(err){
            // Error handler
            res.json(err);
        })        
    })

    // Post route to save article
    app.post("/list/save/:id", function (req,res){
        // If note found, delete
        db.Note.findOneAndUpdate({_id: req.params.id}, {"saved": true})
        // display result
        .then(function(err, dbNote){
            if (err) {
                console.log(err);
            }
            else {
                res.send(dbNote);
            }
        });
    });


    // Post route for updating notes
    app.post("/notes/:id", function(req, res){
        // Create note
        db.Note.create(req.body).then(function(dbNote){
            // Find corresponding article and attach the note 
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
        }).then(function(dbArticle){
            // Send back article with note
            res.json(dbArticle);
        }).catch(function(err){
            // Error handler, send to user
            res.json(err);
        });
    });

  // Post route to delete note
  app.post("/notes/delete/:id", function (req,res){
    // If note found, delete
    db.Note.findOne({_id: req.params.id}).remove("note")
    // display result
    .then(function(dbNote){
        res.json(dbNote);
    }).catch(function(err){
        // Error handler
        res.json(err);
    })
  });
}
