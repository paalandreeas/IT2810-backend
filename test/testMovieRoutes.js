const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");

before (function (done) {
  this.timeout(5000);
  app.on("serverReady", function () {
    console.log("Tests for routes will now run" + "\n");
    done();
  });
});

describe("Route tests: '/movie'", function () {
  this.timeout(5000);
  const baseRoute = "/movie";
  describe("GET: '/'", () => {
    it("It responds with JSON", function (done) {
      request(app)
        .get(baseRoute)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done());
    });

    it("There is a field called movies", function (done) {
      request(app)
        .get(baseRoute)
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body).to.have.property("movies");
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it("There are exactly twelve movies", function (done) {
      request(app)
        .get(baseRoute)
        .set("Accept", "application/json")
        .then((response) => {
          assert.lengthOf(response.body.movies, 12);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    describe("With filters", function () {
      let paramsObject = null;

      beforeEach(function () {
        paramsObject = { q: "The", page: 1 };
      });

      it("Returns correct results on query", function (done) {
        request(app)
          .get(baseRoute)
          .query(paramsObject)
          .set("Accept", "application/json")
          .then((response) => {
            expect(response.body.movies[0].title.toLowerCase()).to.contain(
              "the"
            );
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it("Returns correct page", function (done) {
        paramsObject.page = 2;
        request(app)
          .get(baseRoute)
          .query(paramsObject)
          .set("Accept", "application/json")
          .then((response) => {
            expect(response.body.currentPage).to.equal(2);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it("Valid filter parameters work", function (done) {
        paramsObject.genre = ["Adventure", "Animation"];
        paramsObject.duration = {
          gt: 90,
          lt: 100,
        };
        paramsObject.budget = {
          gt: 70000000,
          lt: 75000000,
        };
        request(app)
          .get(baseRoute)
          .query(paramsObject)
          .set("Accept", "application/json")
          .then((response) => {
            // We know we have at least two movies that fits  the parameters
            expect(response.body.movies).to.have.length.above(1);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    describe("With sort", function () {
      it("Sort works, both ascending and descending", function (done) {
        request(app)
          .get(baseRoute)
          .query({
            sort: {
              type: "title",
              descending: true,
            },
          })
          .set("Accept", "application/json")
          .then((response1) => {
            const titleDescending = response1.body.movies[0].title;

            request(app)
              .get(baseRoute)
              .query({
                sort: {
                  type: "title",
                  descending: false,
                },
              })
              .set("Accept", "application/json")
              .then((response2) => {
                const titleAscending = response2.body.movies[0].title;
                expect(titleAscending.localeCompare(titleDescending)).to.equal(
                  1
                );
                done();
              })
              .catch((error) => {
                done(error);
              });
          })
          .catch((error) => {
            done(error);
          });
      });
    });
  });

  describe("GET: '/:id'", function () {
    const validID = "5fa525759d2a5ddb918cea90";
    const invalidID = "ikkeEnValidId";
    it("It responds with JSON", function (done) {
      request(app)
        .get(baseRoute + "/" + validID)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/, done());
    });

    it("Gets 200 status code with a valid id", function (done) {
      request(app)
        .get(baseRoute + "/" + validID)
        .set("Accept", "application/json")
        .expect(200)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Gets 400 status code with an invalid id", function (done) {
      request(app)
        .get(baseRoute + "/" + invalidID)
        .set("Accept", "application/json")
        .expect(400)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });
  });

  describe("GET: '/:id/reviews'", function () {
    const validID = "5fa525759d2a5ddb918cea90";
    const invalidID = "ikkeEnValidId";
    it("It responds with JSON", function (done) {
      request(app)
        .get(baseRoute + "/" + validID + "/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/, done());
    });

    it("Gets 200 status code with a valid id", function (done) {
      request(app)
        .get(baseRoute + "/" + validID + "/reviews")
        .set("Accept", "application/json")
        .expect(200)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Gets 400 status code with an invalid id", function (done) {
      request(app)
        .get(baseRoute + "/" + invalidID + "/reviews")
        .set("Accept", "application/json")
        .expect(400)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Sees that the response has the field reviews and that it is a list", function (done) {
      request(app)
        .get(baseRoute + "/" + validID + "/reviews")
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body)
            .to.have.property("reviews")
            .and.to.be.a("array");
          done();
        });
    });
  });
});
