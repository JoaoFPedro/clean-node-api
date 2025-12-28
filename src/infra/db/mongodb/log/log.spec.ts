import { MongoHelper } from "../helpers/mongo-helpers";
import { Collection } from "mongodb";
import { LogMongoRepository } from "./log-mongo-repository";
const { MongoClient } = require("mongodb");

const makeSut = () => {
  const sut = new LogMongoRepository();
  return sut;
};
describe("insert", () => {
  let errorCollection: Collection | undefined;
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection?.deleteMany({});
  });

  it("", async () => {
    const sut = makeSut();
    await sut.logError("any_value");
    const count = await errorCollection?.countDocuments();
    expect(count).toBe(1);
  });
});
