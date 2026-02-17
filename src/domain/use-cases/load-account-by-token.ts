import { AccountModel } from "../models/account";

export interface LoadAccountByToken {
  loadByToken(accesToken: string, role?: string): Promise<AccountModel | null>;
}
