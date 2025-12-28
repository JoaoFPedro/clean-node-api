import {
  AccountModel,
  AddAccountModel,
} from "../../../use-cases/add-account/db-add-account-protocols";

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel | null>;
}
