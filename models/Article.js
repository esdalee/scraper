var mongoose = require("mongoose");

// Constructor
var Schema = mongoose.Schema;

// Article object
var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type:String,
        required:true
    }
});

// Create model based on schema
var Article = mongoose.model("Article", ArticleSchema);

// export model
module.exports = Article;