import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepositoryStub: AddAccountRepository,
    private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  ) {}
  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const loadAccount = await this.loadAccountByEmailRepositoryStub.loadByEmail(
      accountData.email,
    );
    if (loadAccount) {
      return null;
    }
    const encryptPassword = await this.encrypter.hash(accountData.password);
    const accountWithEncryptedPassword = {
      ...accountData,
      password: encryptPassword,
    };
    const account = await this.addAccountRepositoryStub.add(
      accountWithEncryptedPassword,
    );
    return account;
  }
}
