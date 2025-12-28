import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helpers";
import { AccountMongoRepository } from "./account-mongo-repository";

const { MongoClient } = require("mongodb");

describe("insert", () => {
  let accountCollection: Collection | undefined;
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/jest";
    await MongoHelper.connect(mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
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
  it("Should Return an account on LoadByEmailSuccess", async () => {
    const { sut } = makeSut();
    await accountCollection?.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe("any_name");
    expect(account?.email).toEqual("any_email@mail.com");
    expect(account?.password).toEqual("any_password");
  });
  it("Should Return false if no account found", async () => {
    const { sut } = makeSut();
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeFalsy();
  });
  it("Should update the account accessToken on updateAccessToken success", async () => {
    const { sut } = makeSut();
    const res = await accountCollection?.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    const fakeAccount = await accountCollection?.findOne({
      _id: res?.insertedId,
    });
    await sut.updateAccessToken(
      fakeAccount?._id.toString() as string,
      "any_token"
    );
    const account = await accountCollection?.findOne({ _id: fakeAccount?._id });
    expect(account).toBeTruthy();
    expect(account?.accessToken).toBe("any_token");
  });
});
