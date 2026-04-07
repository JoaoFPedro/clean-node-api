import { AccountModel } from "@/domain/models/account";
import { AddAccountParams } from "../use-cases/add-account/add-account-use-case";

export const mockAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "aany_email",
  password: "hashed_password",
});

export const mockAddAccountParams = (): AddAccountParams => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});
export const mockAddAccountParamsWithRoleandToken = (): any => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  accessToken: "any_token",
  role: "any_role",
});
export const mockAddAccountParamsWithToken = (): any => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  accessToken: "any_token",
});
export const mockAddAccountParamsAdminRole = (): any => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  accessToken: "any_token",
  role: "admin",
});
