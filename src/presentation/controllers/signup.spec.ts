import { InvalidParamError } from "../erros/invalid-params-erros";
import { MissingParamError } from "../erros/missing-params-erros";
import { EmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}
//Factory
const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  const number = 123;
  return {
    sut,
    emailValidatorStub,
  };
};
describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("Should return 400 if no confirmationPassword is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("confirmationPassword")
    );
  });
  test("Should return 400 if an email is invalid", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});
