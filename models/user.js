const mongoose = require("mongoose");
const { Schema } = mongoose;

//Model for the attributes in a User-Object
const UserSchema = new Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
