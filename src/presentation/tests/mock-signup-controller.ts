import { AccountModel } from "@/domain/models/account";
import { mockAccount } from "@/domain/test/mock-account";
import {
  AddAccount,
  AddAccountParams,
} from "@/domain/use-cases/add-account/add-account-use-case";

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = mockAccount();
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};
