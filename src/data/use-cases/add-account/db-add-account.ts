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
    private readonly addAccountRepositoryStub: AddAccountRepository
  ) {}
  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const encryptPassword = await this.encrypter.hash(accountData.password);
    const accountWithEncryptedPassword = {
      ...accountData,
      password: encryptPassword,
    };
    const account = await this.addAccountRepositoryStub.add(
      accountWithEncryptedPassword
    );
    return account;
  }
}
