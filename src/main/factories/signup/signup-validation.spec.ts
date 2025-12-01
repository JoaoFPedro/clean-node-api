import { Validation } from "../../../presentation/protocols/validation";
import { RequiredFields } from "../../../presentation/helpers/validators/required-field-validation";
import { makeSingUpValidation } from "./signup-validation";
import { CompareFields } from "../../../presentation/helpers/validators";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";

jest.mock("../../../presentation/helpers/validators/validation-composite");

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
