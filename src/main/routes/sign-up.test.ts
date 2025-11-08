import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helpers";

describe("Sign Up Routes", () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection?.deleteMany({});
  });
  it("Should return an account on sucess", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPass: "any_password",
      })
      .expect(200);
  });
});
