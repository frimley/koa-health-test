const request = require("supertest");
const app = require("../src/index");
const chai = require("chai");
const expect = chai.expect;
const common = require("../src/common");

describe("User Endpoints", () => {
  //////////////////////////
  // JWT Token tests
  //////////////////////////

  // Requests a test token then sends it back to be resolved to an expected user id
  it("should validate that a session token can be created and then received to infer a user id", async () => {
    const resToken = await request(app).get("/setAuthTest").send();
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);

    const resTestToken = await request(app)
      .get("/authTest")
      .set("Authorization", `Bearer ${resToken.body.token}`)
      .send();
    expect(resTestToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resTestToken.body).to.have.property("userId").equal("abcdefghijklmnopqrstuvwxyz");
  });

  //////////////////////////
  // Registration tests
  //////////////////////////

  // create random username
  const randomUsername = `test_user${Math.floor(Math.random() * 100000)}`;

  const registrationTest = (description, params, httpResponseCode, detectMessage) => {
    it(description, async () => {
      const res = await request(app).post("/register").send(params);
      expect(res.statusCode).to.equal(httpResponseCode);
      expect(res.body).to.have.property("message").equals(detectMessage);
    });
  };

  // Successful registration
  registrationTest(
    "should register a new user and create a session token successfully",
    {
      username: randomUsername,
      email: `${randomUsername}@test.com`,
      password: "password",
    },
    common.httpCodes.CREATED,
    "User registered",
  );

  // Username length < 5 chars in length
  registrationTest(
    "should return an error when registering with bad input username",
    {
      username: "t",
      email: "test@test.com",
      password: "password",
    },
    common.httpCodes.BAD_REQUEST,
    "Could not register",
  );

  // email incorrect format
  registrationTest(
    "should return an error when registering with bad email",
    {
      username: "testuser",
      email: "t",
      password: "password",
    },
    common.httpCodes.BAD_REQUEST,
    "Could not register",
  );

  // password incorrect length
  registrationTest(
    "should return an error when registering with a bad password",
    {
      username: "testuser",
      email: "test@test.com",
      password: "p",
    },
    common.httpCodes.BAD_REQUEST,
    "Could not register",
  );

  //////////////////////////
  // Login tests
  //////////////////////////

  it("should validate that a user can login and a session token is created", async () => {
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password" });
    expect(resToken.statusCode).to.equal(common.httpCodes.OK);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);
  });

  it("should validate that a user CANNOT login when an incorrect password is provided", async () => {
    const resToken = await request(app).post("/login").send({ username: randomUsername, password: "password_bad" });
    expect(resToken.statusCode).to.equal(common.httpCodes.BAD_REQUEST);
    expect(resToken.body).to.have.property("message").equals("Username or password is incorrect");
  });
});
