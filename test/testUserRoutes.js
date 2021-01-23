const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");


describe("Route tests: '/user'", function () {
    this.timeout(5000);
    const baseRoute = "/user";
    describe("GET: '/:id'", () => {
        it("It responds with JSON", function (done) {
            request(app)
                .get(baseRoute + "/5fae3c70c51dfb29ec5c2d96")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200, done());
        });

        it("Has a field called username", function (done) {
            request(app)
                .get(baseRoute + "/5fae3c70c51dfb29ec5c2d96")
                .set("Accept", "application/json")
                .then((response) => {
                    expect(response.body).to.have.property("username");
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it("Has a field called _id", function (done) {
            request(app)
                .get(baseRoute + "/5fae3c70c51dfb29ec5c2d96")
                .set("Accept", "application/json")
                .then((response) => {
                    expect(response.body).to.have.property("_id");
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it("Has an array called reviews", function (done) {
            request(app)
                .get(baseRoute + "/5fae3c70c51dfb29ec5c2d96")
                .set("Accept", "application/json")
                .then((response) => {
                    expect(response.body).to.have.property("reviews");
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

    });


    describe("POST: '/login'", () => {

     it("Logs in with valid username + password", function (done) {
                request(app)
                    .post(baseRoute + "/login")
                    .send({
                        "username": "admin",
                        "password": "admin",
                    })
                    .expect(200)
                    .end((error, _) => {
                        if (error) {
                            return done(error);
                        }
                        done();
                    });
            });

        it("Fails to log in without valid username + password", function (done) {
            request(app)
                .post(baseRoute + "/login")
                .send({
                    "username": "admin",
                    "password": "wrongPassword",
                })
                .expect(401)
                .end((error, _) => {
                    if (error) {
                        return done(error);
                    }
                    done();
                });
        });

    });

    describe("POST: '/register'", () => {

        it("Fails to register with an existing username", function (done) {
            request(app)
                .post(baseRoute + "/register")
                .send({
                    "username": "admin",
                    "password": "testPassword",
                })
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

        it("Fails to delete user without a valid token", function (done) {
            request(app)
                .delete(baseRoute + "/5fae3c70c51dfb29ec5c2d96")
                .set({Authorization:"invalidToken"})
                .expect(401)
                .end((error, _) => {
                    if (error) {
                        return done(error);
                    }
                    done();
                });
        });

        it("Fails to delete another user", function (done) {
            request(app)
                .delete(baseRoute + "/5fa713133b8bdf3baa17e890")
                .set({Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmFlM2M3MGM1MWRmYjI5ZWM1YzJkOTYiLCJpYXQiOjE2MDUyNTQyNTY4ODUsImV4cCI6MTYwNTI1NDM0MzI4NX0.Yx4mB7PDwnxleaQJj1SmLs1oru_H1Jz8U8e4SLj2yB_2l69U_kXZ6ZbgfjoUYyZmLwoqeluaiCCdX92ObfHYYb2ryM9JSY8dnnUsn_w1ErBIZJ-5VOnV8l6UbqRhOHLpqrRGrgTUicri3rYAwIT_rJOCqC71H-cRlbMfcdjhKO1l0GYilweuaaADMPXZobamLgRjV5iQ5Eq4jkTa7EC2Jxc9IbcTRPYb_W-QInaeTMimY7seAEuUO8_H-jkBigKguFsj_qwmWMQqjsQfgvNUMxcGsxZ2rVIDEfnQi1GjM90re51XiEHNJFqMAPFpGvzRM4VB2EBINaawf1hP7u3W_PzP7TFC3SmaLGjpDNF0h2SVUYwUDme-GChMI6ct6qAj-XhD59MQFpI1euYERkTowvl3XqKmqOgPONaEiLrYi_RJQ-u8Ef3g26bt6NcVhHZWdd1AYtrvRBJaKyTns_FZzJ21rmKoABlUpDxpq4a25L2gVvZWqI8u201yNpeFe4YChTfJCifcv-km9EBt-AW7F0XnaPQtM-FG4ygQ9-aA-OuQ49F5y4LAJNHyxr-3YaG3sImn6-vROPVazbLSsUglqaO55kiGmCuJmHKwKk_vns9RfnHKIwgK855Zdk_xrwGJkgjlQdwVW6KnaPCeoL9MMWnvNaaVML2yil4wIGOOjDg"})
                .expect(403)
                .end((error, _) => {
                    if (error) {
                        return done(error);
                    }
                    done();
                });
        });
    });
});

