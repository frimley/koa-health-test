const request = require("supertest");
const app = require("../src/index");
const chai = require("chai");
const expect = chai.expect;
const common = require("../src/common");

describe("Activity Admin Endpoints", () => {
  // create random username
  const randomUsername = `test_user${Math.floor(Math.random() * 100000)}`;
  // Known admin account with rights to manage activities
  const ADMIN_USERNAME = "admin16180";
  const ADMIN_PASSWORD = "pass16180";

  it("a standard user CANNOT create a new activity", async () => {
    // register a random test user which also gives us a session token for future tests
    const res = await request(app)
      .post("/register")
      .send({
        username: randomUsername,
        email: `${randomUsername}@test.com`,
        password: "password",
      });

    const token = res.body.token;
    expect(res.statusCode).to.equal(common.httpCodes.CREATED);

    const result = await request(app).post("/admin/activity").set("Authorization", `Bearer ${token}`).send({
      title: "Test Activity",
      activityCategoryId: 1,
      durationMinutes: 60,
      activityDifficultyId: 1,
      content: "Test content",
    });
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });

  // create an activity
  it("an admin user can create a new activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).post("/admin/activity").set("Authorization", `Bearer ${token}`).send({
      title: "4-7-8 breathing",
      activityCategoryId: 1,
      durationMinutes: 5,
      activityDifficultyId: 1,
      content: "Breathe in for 4 seconds, hold for 7 seconds, breathe out for 8 seconds. Repeat.",
    });
    expect(result.statusCode).to.equal(common.httpCodes.CREATED);
  });

  // update an activity
  it("an admin user can update an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).put("/admin/activity/1").set("Authorization", `Bearer ${token}`).send({
      title: "4-7-8 breathing",
      activityCategoryId: 1,
      durationMinutes: 5,
      activityDifficultyId: 1,
      content: "Breathe in for 4 seconds, hold for 7 seconds, breathe out for 8 seconds. Repeat.",
    });
    expect(result.statusCode).to.equal(common.httpCodes.CREATED);
  });

  it("a standard user CANNOT update an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).put("/admin/activity/2").set("Authorization", `Bearer ${token}`).send({
      title: "Test Activity",
      activityCategoryId: 1,
      durationMinutes: 60,
      activityDifficultyId: 1,
      content: "Test content",
    });
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });

  // get an activity
  it("an admin user can get an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).get("/admin/activity/2").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.OK);
    expect(result.body).to.have.property("activity").to.be.an("object");
  });

  it("a standard user CANNOT get an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).get("/admin/activity/2").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.UNAUTHORIZED);
  });

  // delete an activity
  it("an admin user can delete an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).delete("/admin/activity/1").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.NO_CONTENT);
  });

  it("a standard user CANNOT delete an activity", async () => {
    // login to retrieve a session token
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
    const token = resToken.body.token;

    const result = await request(app).delete("/admin/activity/1").set("Authorization", `Bearer ${token}`).send();
    expect(result.statusCode).to.equal(common.httpCodes.NO_CONTENT);
  });
});
