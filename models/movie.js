const mongoose = require("mongoose");
const { Schema } = mongoose;

//Model for the attributes in a Movie-Object
const MovieSchema = new Schema({
  title: { type: String, required: true },
  poster_path: { type: String, require: true },
  genre: { type: Array, required: true },
  desc: { type: String, required: true },
  budget: { type: Number, required: true },
  release_date: { type: Date, required: true },
  duration: { type: Number, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
