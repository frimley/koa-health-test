const request = require("supertest");
const app = require("../src/index");
const chai = require("chai");
const expect = chai.expect;
const common = require("../src/common");

describe("Activity Endpoints", () => {
  // create random username
  const randomUsername = `test_user${Math.floor(Math.random() * 100000)}`;

  // List activities
  it("should list all activities available to a logged in user", async () => {
    // register a random test user which also gives us a session token for future tests
    const res = await request(app)
      .post("/register")
      .send({
        username: randomUsername,
        email: `${randomUsername}@test.com`,
        password: "password",
      });

    const sessionToken = res.body.token;
    expect(res.statusCode).to.equal(common.httpCodes.CREATED);

    const result = await request(app).get("/activities").set("Authorization", `Bearer ${sessionToken}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.OK);
    expect(result.body).to.have.property("activities").to.be.an("array");
  });

  // Only logged in users can list activities
  it("should return unauthorized if listing activities when not logged in", async () => {
    const result = await request(app).get("/activities").send();
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });

  it("an activity can be set as completed by a logged in user", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).put("/user/1").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.CREATED);
  });

  it("an activity CANNOT be set as completed by a user not logged in", async () => {
    const result = await request(app).put("/user/1").send();
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });

  it("completed activities can be retrieved by a logged in user", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).get("/user/completed").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.OK);
    expect(result.body).to.have.property("activities").to.be.an("array");
  });

  it("completed activities CANNOT be retrieved by a user not logged in", async () => {
    const result = await request(app).get("/user/completed").send();
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });
});
