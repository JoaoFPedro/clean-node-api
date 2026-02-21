import request from "supertest";
import { setupApp } from "../../config/app";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helpers";
import { Collection } from "mongodb";
import { Express } from "express";
import env from "../../config/env";
import { sign } from "jsonwebtoken";

describe("Survey Routes", () => {
  let surveyCollection: Collection | undefined;
  let app: Express;
  let accountCollection: Collection | undefined;

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
    app = await setupApp();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection?.deleteMany({});

    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection?.deleteMany({});
  });
  describe("POST /surveys", () => {
    it("Should return 403 on surveys", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
            {
              answer: "other_answer",
            },
          ],
        })
        .expect(403);
    });
    it("Should return 204 on add survey with valid accessToken", async () => {
      const res = await accountCollection?.insertOne({
        name: "Joao Pedro",
        email: "any_mail@mail.com",
        password: "123",
        role: "admin",
      });
      const id = res?.insertedId;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection?.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            accessToken,
          },
        },
      );
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
            {
              answer: "other_answer",
            },
          ],
        })
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    it("Should return 403 on LoadSurveys", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    it("Should return 204 on load survey with valid accessToken", async () => {
      const res = await accountCollection?.insertOne({
        name: "Joao Pedro",
        email: "any_mail@mail.com",
        password: "123",
      });
      const id = res?.insertedId;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection?.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            accessToken,
          },
        },
      );
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(204);
    });
  });
});
