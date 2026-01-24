import { Validation } from "../../../../presentation/protocols/validation";
import { RequiredFields } from "../../../../validation/validators/required-field-validation";
import { ValidationComposite } from "../../../../validation/validators/validation-composite";
import { CompareFields } from "../../../../validation/validators";
import { EmailValidatorAdapter } from "../../../../infra/adapters/email-validator-adapter";
import { EmailValidation } from "../../../../validation/validators/email-validation";

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "confirmationPassword"]) {
    validations.push(new RequiredFields(field));
  }
  validations.push(new CompareFields("password", "confirmationPassword"));
  validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));

  return new ValidationComposite(validations);
};
