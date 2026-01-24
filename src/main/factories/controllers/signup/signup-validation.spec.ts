import {
  CompareFields,
  EmailValidation,
  RequiredFields,
  ValidationComposite,
} from "../../../../validation/validators";
import { EmailValidator } from "../../../../presentation/protocols";
import { Validation } from "../../../../presentation/protocols/validation";
import { makeSingUpValidation } from "./signup-validation";

jest.mock("../../../../validation/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe("Signup Validation Factory", () => {
  test("Should call ValidationComposite with all validations ", async () => {
    makeSingUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "confirmationPassword"]) {
      validations.push(new RequiredFields(field));
    }

    validations.push(new CompareFields("password", "confirmationPassword"));
    validations.push(new EmailValidation(makeEmailValidator(), "email"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
