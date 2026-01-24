import { Validation } from "../../../../presentation/protocols/validation";
import { RequiredFields } from "../../../../validation/validators/required-field-validation";
import { ValidationComposite } from "../../../../validation/validators/validation-composite";
import { EmailValidatorAdapter } from "../../../../infra/adapters/email-validator-adapter";
import { EmailValidation } from "../../../../validation/validators/email-validation";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFields(field));
  }
  validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));

  return new ValidationComposite(validations);
};
