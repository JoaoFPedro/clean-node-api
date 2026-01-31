import request from "supertest";
import { setupApp } from "../../config/app";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helpers";
import { Collection } from "mongodb";
import { Express } from "express";

describe("Survey Routes", () => {
  let surveyCollection: Collection | undefined;
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
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection?.deleteMany({});
  });
  describe("POST /surveys", () => {
    it("Should return 204 on surveys", async () => {
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
        .expect(204);
    });
  });
});
