import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepositoryStub: AddAccountRepository;
  constructor(
    encrypter: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepositoryStub = addAccountRepositoryStub;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const encryptPassword = await this.encrypter.encrypt(accountData.password);
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
