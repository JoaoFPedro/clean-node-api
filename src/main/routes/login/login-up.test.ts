import request from "supertest";
import { setupApp } from "../../config/app";
import { Express } from "express";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helpers";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

describe("Login Routes", () => {
  let accountCollection: Collection | undefined;
  let app: Express;

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
    app = await setupApp();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection?.deleteMany({});
  });
  describe("POST /signup", () => {
    it("Should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
          confirmationPassword: "any_password",
        })
        .expect(200);
    });
  });
  describe("POST /login", () => {
    it("Should return 200 on login", async () => {
      const password = await hash("any_password", 12);
      await accountCollection?.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password,
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(200);
    });
    it("Should return 401 on login error", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(401);
    });
  });
});
