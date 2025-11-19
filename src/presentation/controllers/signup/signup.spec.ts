import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/use-cases/add-account-use-case";
import { AccountModel } from "../../../domain/models/account";
import { InvalidParamError, MissingParamError, ServerError } from "../../erros";
import { EmailValidator, HttpRequest, HttpResponse } from "../../protocols";
import { SignUpController } from "./signup";
import { badRequest, serverError, success } from "../../helpers/http-helper";

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

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccount: AddAccount;
  httpRequest: HttpRequest;
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const addAccount = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccount);
  const httpRequest = makeFakeRequest();
  return {
    sut,
    emailValidatorStub,
    addAccount,
    httpRequest,
  };
};
describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
  test("Should return 400 if no confirmationPassword is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("confirmationPassword"))
    );
  });
  test("Should return 400 if confirmation password fail", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "fail_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("confirmationPassword"))
    );
  });
  test("Should return 400 if an email is invalid", async () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    badRequest(new InvalidParamError("email"));
  });
  test("Should Email Validator with correct email", () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut();
    const jestSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  test("Should return 500 if EmailValidator throws", async () => {
    // const emailValidatorWithError = makeEmailValidatorWithError();
    // const sut = new SignUpController(emailValidatorWithError);
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
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
    // const emailValidatorWithError = makeEmailValidatorWithError();
    // const sut = new SignUpController(emailValidatorWithError);
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
});
