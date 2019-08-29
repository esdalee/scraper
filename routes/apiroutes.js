// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../models/Article");
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
                    // console.log(img);

                    // Object for each piece
                    let articlePiece = {
                        headline,
                        summary,
                        url,
                        img
                    }

                    // // Add piece to array
                    articleArray.push(articlePiece);
                })

                db.Article.create(articleArray).then(data => {
                    console.log(data)
                    // res.status(200).json({ data });
                }).catch(err => {
                    console.log(err);
                    // res.status(500).json({
                    //     error: "error occured!"
                    // });
                })
        });
    });

    // Retrieve all stored Articles from db
    app.get("/allarticles", function(req,res){
        db.Article.find({}, function(err, article) {
            // If error, send to user
            if(err) {
                res.json(err);
            }
            // If no error, send articles to user
            else {
                res.json(article);
            }
            // Message user
            res.send("Completed");
        });
    })

    // Get route to attach note to article by id
    app.get("/allarticles/:id", function(req, res){
        // Search article by id then attach notes
        db.Article.findOne({_id: req.params.id}).populate("note")
        .then(function(article){
            // Send article/note to user 
            res.json(article);
        }).catch(function(err){
            // Error handler
            res.json(err);
        })        
    })

    // // Retrieve data
    // app.get("/articles", function(req, res){
    //     // Retrieve every document
    //     Article.find({}).then(function(dbArticle){
    //         // Send back articles
    //         res.json(dbArticle);
    //     }).catch(function(err){
    //         // Error handler, send to user
    //         res.json(err);
    //     })
    // });

}
