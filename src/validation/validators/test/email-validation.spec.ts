import { InvalidParamError } from "@/presentation/erros";
import { EmailValidator } from "@/validation/protocols/email-validator";
import { EmailValidation } from "../email-validation";
import { Validation } from "@/presentation/protocols";
import { mockFakeRequest } from "@/data/test/test-helper";
import { mockEmailValidator } from "@/validation/tests/mock-email-validator";

//Factory

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
interface SutType {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}
const makeSut = (): SutType => {
  const emailValidatorStub = mockEmailValidator();

  const sut = new EmailValidation(emailValidatorStub, "email");
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return an error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({ email: "any_email@mail.com" });

    expect(error).toEqual(new InvalidParamError("email"));
  });
  test("Should Email Validator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const jestSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any_email@mail.com" });
    expect(jestSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  test("Should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
