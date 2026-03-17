import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helpers";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";

const { MongoClient } = require("mongodb");

describe("add", () => {
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
      date: new Date(),
    });
    const survey = await surveyCollection?.findOne({
      question: "any_question",
    });
    expect(survey).toBeTruthy();
  });
});
describe("load", () => {
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
  it("Should load all survey on success", async () => {
    await surveyCollection?.insertMany([
      {
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
        ],
        date: new Date(),
      },
      {
        question: "other_question",
        answers: [
          {
            image: "other_question_image",
            answer: "other_question_answer",
          },
        ],
        date: new Date(),
      },
    ]);
    const { sut } = makeSut();
    const surveys = await sut.loadSurveys();

    expect(surveys?.length).toBe(2);
    expect(surveys?.[0].question).toBe("any_question");
  });
});
describe("loadById", () => {
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
  it("Should load all survey on success", async () => {
    const res = await surveyCollection?.insertOne({
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    });
    const { sut } = makeSut();
    const id = res?.insertedId;

    const surveys = await sut.loadById(id?.toString() as string);
    expect(surveys).toBeTruthy();
    expect(surveys.id).toBeTruthy();
  });
});
