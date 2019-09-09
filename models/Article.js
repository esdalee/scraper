// Mongoose to construct schema
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
        type: String,
        required:true
    },
    img: {
        // data: Buffer,
        type: String,
        required:true
    },
    saved: {
        type: Boolean,
        default: false
      },
    // Store ObjectId of Notes
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
        }]
});

// Create model based on schema
var Article = mongoose.model("Article", ArticleSchema);

// export Article model
module.exports = Article;