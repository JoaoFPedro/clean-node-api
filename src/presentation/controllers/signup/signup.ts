import { badRequest, serverError, success } from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../erros";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../../protocols";
import { AddAccount } from "../../../domain/use-cases/add-account-use-case";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "confirmationPassword",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, password, confirmationPassword, email } = httpRequest.body;
      if (password !== confirmationPassword) {
        return badRequest(new InvalidParamError("confirmationPassword"));
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const addAccount = await this.addAccount.add({
        email,
        name,
        password,
      });

      return success(addAccount);
    } catch (error) {
      return serverError();
    }
  }
}
