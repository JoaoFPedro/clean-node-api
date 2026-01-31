import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helpers";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";

const { MongoClient } = require("mongodb");

describe("insert", () => {
  let surveyCollection: Collection | undefined;
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection?.deleteMany({});
  });
  interface SutType {
    sut: SurveyMongoRepository;
  }
  const makeSut = (): SutType => {
    const sut = new SurveyMongoRepository();
    return {
      sut,
    };
  };
  it("Should add a survey on success", async () => {
    const { sut } = makeSut();
    await sut.add({
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
    });
    const survey = await surveyCollection?.findOne({
      question: "any_question",
    });
    expect(survey).toBeTruthy();
  });
});
