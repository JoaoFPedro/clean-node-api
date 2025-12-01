import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/use-cases/add-account-use-case";
import { AccountModel } from "../../../domain/models/account";
import { MissingParamError, ServerError } from "../../erros";
import { EmailValidator, HttpRequest } from "../../protocols";
import { SignUpController } from "./signup";
import { Validation } from "../../protocols/validation";
import {
  serverError,
  success,
  badRequest,
} from "../../helpers/http/http-helper";

//Factory
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};
const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      confirmationPassword: "any_password",
    },
  };
};
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccount: AddAccount;
  httpRequest: HttpRequest;
  validationStub: Validation;
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const addAccount = makeAddAccount();

  const httpRequest = makeFakeRequest();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccount, validationStub);
  return {
    sut,
    emailValidatorStub,
    addAccount,
    httpRequest,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("Should call AddAcount with correct values", () => {
    const { sut, addAccount, httpRequest } = makeSut();
    const jestSpy = jest.spyOn(addAccount, "add");
    sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccount, httpRequest } = makeSut();
    jest.spyOn(addAccount, "add").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
  test("Should return 200 if sucess", async () => {
    const { sut, httpRequest } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success(makeFakeAccount()));
  });
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    const jestSpy = jest.spyOn(validationStub, "validate");
    await sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
