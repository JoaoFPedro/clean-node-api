import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helpers";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";
import {
  mockAddSurveyOneAnswer,
  mockAddSurveyTwoAnswers,
} from "@/domain/test/mock-survey";

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
    await sut.add(mockAddSurveyOneAnswer());
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
    await surveyCollection?.insertMany(mockAddSurveyTwoAnswers());
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
    const res = await surveyCollection?.insertOne(mockAddSurveyOneAnswer());
    const { sut } = makeSut();
    const id = res?.insertedId;

    const surveys = await sut.loadById(id?.toString() as string);
    expect(surveys).toBeTruthy();
    expect(surveys.id).toBeTruthy();
  });
});
