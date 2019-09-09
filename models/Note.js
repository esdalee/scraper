// Mongoose to construct schema
var mongoose = require("mongoose");

// Constructor
var Schema = mongoose.Schema;

// Article object
var NoteSchema = new Schema({
    subject: String,
    body: String
});

// Create model based on schema
var Note = mongoose.model("Note", NoteSchema);

// export Note model
module.exports = Note;