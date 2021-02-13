const mongoose = require("mongoose");
const NoteFolder = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_date: {
    type: Number,
    required: true,
  },
  last_modified_date: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("NoteFolder", NoteFolder);
