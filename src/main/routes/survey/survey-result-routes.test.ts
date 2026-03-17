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
  describe("PUT /surveys/:surveyId/results", () => {
    it("Should return 403 on save surveyResult without accessToken", async () => {
      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(403);
    });
  });
});
