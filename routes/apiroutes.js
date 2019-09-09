// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
    // Scrape data
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
                // console.log(headline);

                // Summary
                let summary = $(element).children("span.newsblock-story-card__info").children("p").text();
                // console.log(summary);

                // URL
                let url = $(element).children("span.newsblock-story-card__info").children("h2").children("a").attr("href");
                // console.log(url);

                // Image    
                let img = $(element).children("span.newsblock-story-card__image-link").children(".img-wireframe__image").attr("src");
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

    // Get All Articles from db
    app.get("/list", function(req,res){
        db.Article.find({}).limit(20).then(function(dbArticle) {
            // console.log(dbArticle);
                var hbsObj = {
                    article: dbArticle
                };
                // Send back articles
                res.render("list", hbsObj);
        }).catch(err => 
            console.log(err)
        );
    });

    // Get Saved Articles from db
    app.get("/saved", function(req,res){
        db.Article.find({saved: true}).populate("note").then(function(dbArticle) {
            var hbsObj = {
                article: dbArticle
            };
            // Send back saved articles
                res.render("saved", hbsObj);
        }).catch(err =>
            console.log(err)
        );
    });

    // Get Route to Save Article
    app.get("/save/:id", function(req, res){
        // Search article by id
        db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}).then(function(dbArticle) {
            // Redirect user to Saved Articles Pg
            res.redirect("/list");
        }).catch(function(err){
            // Error handler
            res.render(err);
        })
    });

    // Delete Route to Remove Article
    app.delete("/delete/:id", function(req, res){
        // Search article by id
        db.Article.findOneAndRemove({_id: req.params.id})
        .then(function(dbArticle) {
            // Redirect user to Saved Articles Pg
            res.redirect("/saved");
        }).catch(function(err){
            // Error handler
            res.render(err);
        })
    });

    // Routes for Notes
    // Get route to return note of an article
    app.get("/saved/note/:id", function(req, res){
        // Search article by id then attach notes
        db.Note.findOne({_id: req.params.id})
        .then(function(dbNote) {
            // Redirect to page
            res.json(dbNote);
        }).catch(function(err){
            // Error handler
            res.json(err);
        })
    })

    // Post route for creating/saving note
    app.post("/saved/note/create/:id", function(req, res){
        // Create note
        db.Note.create(req.body).then(function(dbNote){
            // Find corresponding article and attach the note 
            db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}}, {new: true});
        }).then(function(note){
            // Send back article with note
            res.json(note);
        }).catch(function(err){
            // Error handler, send to user
            res.json(err);
        });
    });

  // Post route to delete note
  app.post("/saved/note/delete/:id", function (req,res){
    // If note found, delete
    db.Note.findOneAndRemove({_id: req.params.id})
    // display result
    .then(function(dbNote){
        res.json(dbNote);
    }).catch(function(err){
        // Error handler
        res.json(err);
    })
  });
}
