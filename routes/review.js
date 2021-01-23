const express = require("express");
const Movie = require("../models/movie");
const router = express.Router();
const Review = require("../models/review");
const User = require("../models/user");
const passport = require("passport");

//Method for retrieving a review from id. Does not need to check token, as everyone should be able to see reviews
router.get("/:id", async (req, res, next) => {
  Review.findOne({ _id: req.params.id })
    .select("-__v")
    .then(async (review) => {
      review = review.toObject();
      await User.findOne({ _id: review.userID })
        .select("username")
        .then((user) => {
          review.username = user.username;
        })
        .catch((error) => {
          next(error);
        });
      await Movie.findOne({ _id: review.movieID })
        .select("title")
        .then((movie) => {
          review.movieTitle = movie.title;
        })
        .catch((error) => {
          next(error);
        });
      return review;
    })
    .then((review) => {
      res.status(200).json(review);
    })
    .catch((error) => {
      res.status(400).json({
        error: "Review with id: " + req.params.id + " doesn't exist",
        message: error.message,
      });
    });
});

//Method for adding new reviews
router.post(
  "/",
  //Checks if the user has a valid token
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    //Check if the review is on the correct format
    if (req.body.rating !== undefined || req.body.text !== undefined) {
      let reviewExists = await Review.exists(
        //Checks if a review with the same movie-user combination exists already
        {
          movieID: req.body.movieID.toString(),
          userID: req.user._id.toString(),
        }
      );
      if (!reviewExists) {
        let newReview = req.body;
        newReview.userID = req.user._id.toString();
        //Creates the new review
        Review.create(newReview)
          .then((newReview) => {
            //Updates the related movie with the new review
            Movie.findOneAndUpdate(
              { _id: newReview.movieID },
              { $push: { reviews: newReview._id } },
              { new: true, useFindAndModify: false }
            ).then();
            //Updates the related user with the new review
            User.findOneAndUpdate(
              { _id: newReview.userID },
              { $push: { reviews: newReview._id } },
              { new: true, useFindAndModify: false }
            ).then();
            return newReview;
          })
          .then((newReview) => res.status(201).json(newReview))
          .catch(next);
      } else {
        res.status(409).json({ error: "You have already reviewed this movie" });
      }
    } else {
      res.status(400).json({ error: "Not a valid review" });
    }
  }
);

//Method for deleting reviews
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    //Check is the chosen id exists before deleting
    await Review.findOne({ _id: req.params.id })
      .then((data) => {
        //Checks if the chosen review were made by the used logged in
        if (data.userID.toString() === req.user._id.toString()) {
          Review.findOneAndDelete({ _id: req.params.id })
            .then((deletedReview) => {
              //Updates the related movie with the deleted review
              Movie.findOneAndUpdate(
                { _id: deletedReview.movieID },
                { $pull: { reviews: deletedReview._id } },
                { new: true, useFindAndModify: false }
              ).then();
              //Updates the related user with the deleted review
              User.findOneAndUpdate(
                { _id: deletedReview.userID },
                { $pull: { reviews: deletedReview._id } },
                { new: true, useFindAndModify: false }
              ).then();
              return deletedReview;
            })
            .then((deletedReview) => {
              res
                .status(200)
                .json({ message: `Review ${deletedReview._id} deleted` });
            })
            .catch((error) =>
              res.status(500).json({
                error:
                  "Something went wrong with updating connected user and movie",
                message: error.message,
              })
            );
        } else {
          res.status(403).json({ error: "Not your review" });
        }
      })
      .catch((error) =>
        res.status(400).json({
          error: "Review with id: " + req.params.id + " doesn't exist",
          message: error.message,
        })
      );
  }
);

//Method for updating reviews
router.put(
  "/:id",
  //Checks if token is valid
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    await Review.findOne({ _id: req.params.id })
      .then((data) => {
        //Checks if the review were made by the user logged in
        if (data.userID.toString() === req.user._id.toString()) {
          //Checks if the new review is valid
          if (req.body.rating !== undefined || req.body.text !== undefined) {
            Review.findOneAndUpdate(
              { _id: req.params.id },
              { rating: req.body.rating, text: req.body.text },
              { useFindAndModify: false }
            )
              .then(res.status(200).json({ message: "Review updated" }))
              .catch((error) =>
                res.status(500).json({
                  error: "Could not update review",
                  message: error.message,
                })
              );
          } else {
            res.status(400).json({ error: "Not a valid review" });
          }
        } else {
          res.status(403).json({ error: "Not your review" });
        }
      })
      .catch((error) => {
        res.status(400).json({
          error: "Review with id: " + req.params.id + " doesn't exist",
          message: error.message,
        });
      });
  }
);

module.exports = router;
