import { makeLoginValidation } from "./login-validation";

import { EmailValidator } from "../../../../presentation/protocols";
import {
  RequiredFields,
  EmailValidation,
  ValidationComposite,
} from "../../../../validation/validators";
import { Validation } from "../../../../presentation/protocols/validation";

jest.mock("../../../../validation/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe("Login Validation Factory", () => {
  test("Should call ValidationComposite with all validations ", async () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFields(field));
    }

    validations.push(new EmailValidation(makeEmailValidator(), "email"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
