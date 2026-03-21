import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";

import { MongoHelper } from "../helpers/mongo-helpers";
import {
  AccountModel,
  AddAccountParams,
} from "../../../../presentation/controllers/login/signup/signup-controller-protocols";
import { LoadAccountByToken } from "../../../../domain/use-cases/add-account/load-account-by-token";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByToken
{
  async add(account: AddAccountParams): Promise<AccountModel | null> {
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
      },
    );
  }
  async loadByToken(
    accesToken: string,
    role?: string,
  ): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection?.findOne({
      accessToken: accesToken,
      $or: [
        {
          role,
        },
        {
          role: "admin",
        },
      ],
    });
    return account && MongoHelper.map(account);
  }
}
