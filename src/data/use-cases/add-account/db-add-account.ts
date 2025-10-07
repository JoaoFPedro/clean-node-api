import { AccountModel } from "../../../domain/models/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/use-cases/add-account-use-case";
import { Encrypter } from "../../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async add(account: AddAccountModel): Promise<AccountModel | null> {
    this.encrypter.encrypt(account.password);
    return null;
  }
}
