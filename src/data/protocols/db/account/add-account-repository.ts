import {
  AccountModel,
  AddAccountParams,
} from "@/data/use-cases/add-account/db-add-account-protocols";

export interface AddAccountRepository {
  add(account: AddAccountParams): Promise<AccountModel | null>;
}
