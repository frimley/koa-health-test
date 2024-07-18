const request = require("supertest");
const app = require("../src/index");
const chai = require("chai");
const expect = chai.expect;

describe("Auth Endpoints", () => {
  /*
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).to.equal(201);
    expect(res.text).to.equal("User registered");
  });

  it("should login an existing user", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("token");
  });
*/

  // Requests a test token then sends it back to be resolved to an expected user id
  it("should validate that a session token can be created and then received to infer a user id", async () => {
    const resToken = await request(app).get("/setAuthTest").send();
    expect(resToken.statusCode).to.equal(200);
    expect(resToken.body).to.have.property("token").length.to.greaterThan(1);

    const resTestToken = await request(app)
      .get("/authTest")
      .set("Authorization", `Bearer ${resToken.body.token}`)
      .send();
    expect(resTestToken.statusCode).to.equal(200);
    expect(resTestToken.body).to.have.property("userId").equal("abcdefghijklmnopqrstuvwxyz");
  });
});
