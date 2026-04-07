import { AccountModel } from "@/domain/models/account";
import { AddAccountRepository } from "../protocols/db/account/add-account-repository";
import { AddAccountParams } from "@/domain/use-cases/add-account/add-account-use-case";
import { mockAccount } from "@/domain/test/mock-account";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";

export const mockAddAccountRespository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountParams): Promise<AccountModel | null> {
      const fakeAccount = mockAccount();
      return fakeAccount;
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountModel | null> {
        return null;
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

export const mockloadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      loadByToken(token: string, role?: string): Promise<AccountModel | null> {
        return new Promise((resolve) => resolve(mockAccount()));
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async updateAccessToken(value: string, token: string): Promise<void> {
        return;
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };
