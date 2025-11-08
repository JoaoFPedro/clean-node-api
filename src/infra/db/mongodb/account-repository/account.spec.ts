import { MongoHelper } from "../helpers/mongo-helpers";
import { AccountMongoRepository } from "./account-mongo-repository";

const { MongoClient } = require("mongodb");

describe("insert", () => {
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
  interface SutType {
    sut: AccountMongoRepository;
  }
  const makeSut = (): SutType => {
    const sut = new AccountMongoRepository();
    return {
      sut,
    };
  };
  it("Should Return an account on sucess", async () => {
    const { sut } = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe("any_name");
    expect(account?.email).toEqual("any_email@mail.com");
    expect(account?.password).toEqual("any_password");
  });
});
