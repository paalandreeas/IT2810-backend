const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const movieRoute = require("./routes/movie");
const userRoute = require("./routes/user");
const reviewRoute = require("./routes/review");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();

const app = express();

//Connects to the DB
const connectToDB = new Promise((resolve, reject) => {
  mongoose
    .connect(
      process.env.MONGODB_URI,
      // "mongodb://amdb:amdb@it2810-59.idi.ntnu.no:27017/amdb_v2?authSource=amdb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Database connected successfully");
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
});

require("./config/passport")(passport);

app.use(passport.initialize());

//Uses CORS because the server and client is running on different ports
app.use(cors());

//Sets the server port to 5000
const port = 5000;

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

//Allows CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

//Routes the requests to the correct endpoint
app.use("/movie", movieRoute);
app.use("/user", userRoute);
app.use("/review", reviewRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Something went wrong", message: err.message });
  next();
});

connectToDB.then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    app.emit("serverReady");
  });
});

module.exports = app;
