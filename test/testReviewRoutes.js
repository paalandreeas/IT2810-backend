const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");

describe("Route tests: '/review'", function () {
  this.timeout(5000);
  const baseRoute = "/review";
  describe("GET: '/:id'", () => {
    it("It responds with JSON", function (done) {
      request(app)
        .get(baseRoute + "/5fae3d3dc51dfb29ec5c2d97")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done());
    });

    it("Has a field called rating", function (done) {
      request(app)
        .get(baseRoute + "/5fae3d3dc51dfb29ec5c2d97")
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body).to.have.property("rating");
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it("Has a field called text", function (done) {
      request(app)
        .get(baseRoute + "/5fae3d3dc51dfb29ec5c2d97")
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body).to.have.property("text");
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it("Has a field called movieID", function (done) {
      request(app)
        .get(baseRoute + "/5fae3d3dc51dfb29ec5c2d97")
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body).to.have.property("movieID");
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe("POST: '/'", () => {
    it("Logs in", function (done) {
      request(app)
        .post("/user/login")
        .send({
          username: "admin",
          password: "admin",
        })
        .set("Accept", "application/json")
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to post without a valid body", function (done) {
      request(app)
        .post(baseRoute)
        .set({
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg",
        })
        .send({
          testRating: 3,
          testText: "test",
        })
        .expect(400)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to post without a valid token", function (done) {
      request(app)
        .post(baseRoute)
        .set({ Authorization: "invalidToken" })
        .send({
          rating: 3,
          text: "test",
          movieID: "5fa525759d2a5ddb918ce858",
        })
        .expect(401)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to post when a review for the given movie already exists", function (done) {
      request(app)
        .post(baseRoute)
        .set({
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg",
        })
        .send({
          rating: 3,
          text: "test",
          movieID: "5fa525759d2a5ddb918ce858",
        })
        .expect(409)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });
  });

  describe("PUT: '/:id'", () => {
    it("Fails to update without a valid body", function (done) {
      request(app)
        .put(baseRoute + "/5fae3d3dc51dfb29ec5c2d97")
        .set({
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg",
        })
        .send({
          wrongNewText: "Wrong text",
        })
        .expect(400)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to update another users review", function (done) {
      request(app)
        .put(baseRoute + "/5fae5455ee24bc434d3702d7")
        .set({
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg",
        })
        .expect(403)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to update when not authorized", function (done) {
      request(app)
        .put(baseRoute + "/test")
        .set({ Authorization: "invalidToken" })
        .expect(401)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });
  });

  describe("DELETE: '/:id'", () => {
    it("Fails to delete another users review", function (done) {
      request(app)
        .delete(baseRoute + "/5fae5455ee24bc434d3702d7")
        .set({
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg",
        })
        .expect(403)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });

    it("Fails to delete when not authorized", function (done) {
      request(app)
        .delete(baseRoute + "/test")
        .set({ Authorization: "invalidToken" })
        .expect(401)
        .end((error, _) => {
          if (error) {
            return done(error);
          }
          done();
        });
    });
  });
});
