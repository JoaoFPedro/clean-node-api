import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import {
  AccountModel,
  AddAccountModel,
} from "../../../../presentation/controllers/signup/signup-protocols";
import { MongoHelper } from "../helpers/mongo-helpers";

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const insertAccount = await accountCollection?.insertOne(account);
    const result = await accountCollection?.findOne({
      _id: insertAccount?.insertedId,
    });
    if (!result) return null;

    return result ? MongoHelper.map(result) : null;
  }
}
