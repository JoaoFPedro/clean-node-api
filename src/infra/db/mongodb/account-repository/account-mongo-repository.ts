import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/update-access-token-repository";
import {
  AccountModel,
  AddAccountModel,
} from "../../../../presentation/controllers/signup/signup-protocols";
import { MongoHelper } from "../helpers/mongo-helpers";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const insertAccount = await accountCollection?.insertOne(account);
    const result = await accountCollection?.findOne({
      _id: insertAccount?.insertedId,
    });
    if (!result) return null;

    return result ? MongoHelper.map(result) : null;
  }
  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection?.findOne({ email });
    return account && MongoHelper.map(account);
  }
  async updateAccessToken(value: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection?.updateOne(
      { _id: new ObjectId(value) },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
}
