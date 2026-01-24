import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/use-cases/add-account-use-case";
import { AccountModel } from "../../../domain/models/account";
import { MissingParamError, ServerError, EmailInUseError } from "../../erros";
import { EmailValidator, HttpRequest } from "../../protocols";
import { SignUpController } from "./signup-controller";
import { Validation } from "../../protocols/validation";
import {
  serverError,
  success,
  badRequest,
  unauthorized,
  forbidden,
} from "../../helpers/http/http-helper";
import {
  Authentication,
  AuthenticationModel,
} from "../login/login-controller-protocols";

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
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authenticantion: AuthenticationModel): Promise<string | null> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
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
  authenticationStub: Authentication;
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const addAccount = makeAddAccount();
  const authenticationStub = makeAuthentication();

  const httpRequest = makeFakeRequest();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    addAccount,
    validationStub,
    authenticationStub,
  );
  return {
    sut,
    emailValidatorStub,
    addAccount,
    httpRequest,
    validationStub,
    authenticationStub,
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
    expect(httpResponse).toEqual(success({ accessToken: "any_token" }));
  });
  test("Should return 403 if addAccount returns null", async () => {
    const { sut, httpRequest, addAccount } = makeSut();
    jest
      .spyOn(addAccount, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
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
      badRequest(new MissingParamError("any_field")),
    );
  });

  test("Should call  Authentication with correct params", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      ); //assim pq o metodo é async

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
