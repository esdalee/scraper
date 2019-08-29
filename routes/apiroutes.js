// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../models/Article");
// var db = require("../models");

module.exports = function(app) {
    // Store data
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

                    // Object for each piece
                    let articlePiece = {
                        headline,
                        summary,
                        url
                    }

                    // // Add piece to array
                    articleArray.push(articlePiece);
                })

                Article.create(articleArray).then(data => {
                    console.log(data)
                    res.status(200).json({ data });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: "error occured!"
                    });
                })
        });

        // Article.find({}, function(err, found) {
        //     // Error handling
        //     if(err) {
        //         console.log(err);
        //     }
        //     else {
        //         res.json(found);
        //     }

        //     // Message user
        //     res.send("Completed");
        // });
    });


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
