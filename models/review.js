const mongoose = require("mongoose");
const { Schema } = mongoose;

//Model for the attributes in a Review-Object
const ReviewSchema = new Schema({
  rating: { type: Number, required: true },
  text: { type: String, require: true },
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movieID: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
