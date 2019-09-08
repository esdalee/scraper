// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
    // Scrape & display data
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

    // Get All Articles from db
    app.get("/list", function(req,res){
        db.Article.find({}).limit(20).then(function(dbArticle) {
            console.log(dbArticle);
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
        db.Article.find({"saved": true}).populate("notes").then(function(dbArticle) {
            var hbsObj = {
                article: dbArticle
            };
            // Send back saved articles
                res.render("saved", hbsObj);
        }).catch(err =>
            console.log(err)
        );
    });

    // Post Route to Save Article
    app.post("/saved/:id", function(req, res){
        // Search article by id
        db.Article.findOneAndUpdate({_id: req.params.id}, {"saved": true}).then(function(dbArticle) {
            // Redirect user to Saved Articles Pg
            res.redirect("/saved");
        }).catch(function(err){
            // Error handler
            res.render(err);
        })
    });

    // UPDATE THIS
    // Get route to attach note to article by id
    app.get("/saved/:id", function(req, res){
        // Search article by id then attach notes
        db.Article.findOne({_id: req.params.id}).populate("note").then(function(dbArticle) {
            // Redirect to page
            res.redirect("/saved");
        }).catch(function(err){
            // Error handler
            res.json(err);
        })
    })

    // Post route for creating and updating notes
    app.post("/notes/:id", function(req, res){
        // Create note
        db.Note.create(req.body).then(function(dbNote){
            // Find corresponding article and attach the note 
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
        }).then(function(dbNote){
            // Send back article with note
            res.json(dbNote);
        }).catch(function(err){
            // Error handler, send to user
            res.json(err);
        });
    });

  // Post route to delete note
  app.post("/notes/delete/:id", function (req,res){
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
