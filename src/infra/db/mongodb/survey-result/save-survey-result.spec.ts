import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helpers";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";
import { SurveyModel } from "@/domain/models/load-survey-model";
import { AccountModel } from "@/domain/models/account";
import { SurveyResultMongoRepository } from "./save-survey-result";
import { mockAddAccountParams } from "@/domain/test/mock-account";
import { mockAddSurveyOneAnswer } from "@/domain/test/mock-survey";

const { MongoClient } = require("mongodb");

let surveyCollection: Collection | undefined;
let accountCollection: Collection | undefined;
let surveyResultCollection: Collection | undefined;

interface SutType {
  sut: SurveyResultMongoRepository;
}
const makeSut = (): SutType => {
  const sut = new SurveyResultMongoRepository();
  return {
    sut,
  };
};
const makeSurvey = async () => {
  const res = await surveyCollection?.insertOne(mockAddSurveyOneAnswer());
  const surveyDoc = await surveyCollection?.findOne({ _id: res?.insertedId });
  if (!surveyDoc) throw new Error("Survey not found");
  return surveyDoc; // return raw document
};

const makeAccount = async () => {
  const res = await accountCollection?.insertOne(mockAddAccountParams());
  const accountDoc = await accountCollection?.findOne({ _id: res?.insertedId });
  return accountDoc; // return raw document
};
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

  accountCollection = await MongoHelper.getCollection("accounts");
  await accountCollection?.deleteMany({});

  surveyResultCollection = await MongoHelper.getCollection("surveyResults");
  await surveyResultCollection?.deleteMany({});
});
describe("save", () => {
  test("Should save a survey result if is new", async () => {
    const survey = await makeSurvey();
    const account = await makeAccount();
    if (!account) {
      throw new Error("Account not found");
    }
    const { sut } = makeSut();

    const surveyResult = await sut.save({
      surveyId: survey._id.toString(),
      accountId: account._id.toString(),
      answer: survey.answers[0].answer,
      date: new Date(),
    });

    expect(surveyResult).toBeTruthy();
    expect(surveyResult?.id).toBeTruthy();
    expect(surveyResult?.answer).toBe(survey.answers[0].answer);
  });
  test("Should update a survey result if it is not new", async () => {
    const survey = await makeSurvey();
    const account = await makeAccount();

    const surveyResultCollection =
      await MongoHelper.getCollection("surveyResults");

    const res = await surveyResultCollection?.insertOne({
      surveyId: survey._id,
      accountId: account?._id,
      answer: survey.answers[0].answer,
      date: new Date(),
    });

    const { sut } = makeSut();

    if (!account) {
      throw new Error("Account not found");
    }
    const surveyResult = await sut.save({
      surveyId: survey._id.toString(),
      accountId: account._id.toString(),
      answer: survey.answers[1].answer,
      date: new Date(),
    });

    expect(surveyResult).toBeTruthy();
    expect(surveyResult?.id.toString()).toEqual(res?.insertedId?.toString());
    expect(surveyResult?.answer).toBe(survey.answers[1].answer);
  });
});
