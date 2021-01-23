const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const qs = require("qs");
const Review = require("../models/review");
const User = require("../models/user");

// Generates an FindObject that the get(/) method uses to filter.
const makeFindObject = (queryObject) => {
  //Create an empty object
  let findObject = {};
  // If the queryObject has query for title, generate a regex condition on title. The i flag make the regex not case senitive
  if (queryObject.q) {
    const regex = new RegExp("^" + queryObject.q, "i");
    findObject.title = { $regex: regex };
  }
  // If the queryObject has genres, generate an $all condition on the genres
  if (queryObject.genre) {
    findObject.genre = { $all: queryObject.genre };
  }
  //if the queryObject has duration, generate lower and upper limit on duration
  if (queryObject.duration) {
    findObject.duration = {
      $lt: queryObject.duration.lt,
      $gt: queryObject.duration.gt,
    };
  }
  //if the queryObject has budget, generate lower and upper limit on budget
  if (queryObject.budget) {
    findObject.budget = {
      $lt: queryObject.budget.lt,
      $gt: queryObject.budget.gt,
    };
  }

  // Returns the findObject
  return findObject;
};

//Method for making a sortObject from the queryObject.
const makeSortObject = (queryObject) => {
  let descending = 0;
  //Checks if the queryObject includes sorting
  if (queryObject.sort) {
    //Decides what way to sort.
    if (queryObject.sort.descending === "true") {
      descending = -1;
    } else {
      descending = 1;
    }
    //if queryObject sort on title, sort on title
    if (queryObject.sort.type === "title") {
      return { title: -descending };
    }
    //if queryObject sorts on duration, sort on duration
    if (queryObject.sort.type === "duration") {
      return { duration: descending };
    }
    //if queryObject sort on budget, sort on budget
    if (queryObject.sort.type === "budget") {
      return { budget: descending };
    }
  }
  //Sorts by default on title if no other sorting has been chosen.
  return { title: 1 };
};

//Main method for retrieving movies
router.get("/", async (req, res) => {
  // Parses the request query and makes it into an object
  const queryObject = qs.parse(req.query);
  // Generates the corresponding findObject based on the query.
  const findObject = makeFindObject(queryObject);
  // If the queryObject has a limit, set that limit. Else set it to 12
  const pageLimit = queryObject.limit ? queryObject.limit : 12;

  try {
    //Gets all movies that match the query without pagination to get the total number of movies for the given query.
    const unPaginatedMovies = await Movie.find(findObject).exec();
    const count = unPaginatedMovies.length;

    //Gets the movies that match the query, with pagination
    let movies = await Movie.find(findObject, {
      //Return id, title and poster_path for the movies.
      _id: 1,
      title: 1,
      poster_path: 1,
    })
      .limit(parseInt(pageLimit))
      .skip((queryObject.page - 1) * parseInt(pageLimit))
      .collation({ locale: "en" })
      //Sorts on the generated sortObject
      .sort(makeSortObject(queryObject))
      .exec();

    res.status(200).json({
      movies,
      //Return the movies, as well as totalPages and currentPage
      totalPages: Math.ceil(count / parseInt(pageLimit)),
      currentPage: queryObject.page * 1, // The *1 is to make currentPage a number
    });
  } catch {
    res.status(400).json({ error: "Could not fetch on query" });
  }
});

//Return a movie from id aswell as the average rating-score from the review-objects connected to the movie
router.get("/:id", async (req, res) => {
  await Movie.findOne({ _id: req.params.id })
    .then(async (movie) => {
      //Sets the average review score to null on default
      let averageReview = null;
      //Finds the related reviews, iterates over them and finds the average rating.
      await Review.find({ movieID: movie._id })
        .then((reviews) => {
          if (reviews.length > 0) {
            for (const review of reviews) {
              averageReview += review.rating;
            }
            averageReview =
              Math.round((averageReview / reviews.length) * 100) / 100;
          }
          return averageReview;
        })
        .then((averageReview) => {
          res.status(200).json({
            movie: movie,
            averageRating: averageReview,
          });
        })
        .catch((error) =>
          res.json({
            error: "An error occured with the reviews of the movie",
            message: error.message,
          })
        );
    })
    .catch((error) => {
      res.status(400).json({
        error: "Movie with id " + req.params.id + " doesn't exist",
        message: error.message,
      });
    });
});

router.get("/:id/reviews", async (req, res) => {
  Review.find({ movieID: req.params.id })
    .then(async (reviews) => {
      const completeReviews = [];
      for (let review of reviews) {
        review = review.toObject();
        await User.findOne({ _id: review.userID })
          .select("username")
          .then((user) => {
            review.username = user.username;
          })
          .catch((error) => {
            res.status(400).json({
              error:
                "Could not get user of one of the reviews for movie " +
                req.params.id,
              message: error.message,
            });
          });
        await Movie.findOne({ _id: review.movieID })
          .select("title")
          .then((movie) => {
            review.movieTitle = movie.title;
          })
          .catch((error) => {
            res.status(400).json({
              error:
                "Could not get movie title of one of the reviews for movie " +
                req.params.id,
              message: error.message,
            });
          });
        completeReviews.push(review);
      }
      return completeReviews;
    })
    .then((reviews) => {
      res.status(200).json({ reviews: reviews });
    })
    .catch((error) => {
      res.status(400).json({
        error: "Could not get reviews for movie " + req.params.id,
        message: error.message,
      });
    });
});

module.exports = router;
