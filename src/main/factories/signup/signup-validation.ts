import { Validation } from "../../../presentation/protocols/validation";
import { RequiredFields } from "../../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { CompareFields } from "../../../presentation/helpers/validators";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "confirmationPassword"]) {
    validations.push(new RequiredFields(field));
  }
  validations.push(new CompareFields("password", "confirmationPassword"));
  validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));

  return new ValidationComposite(validations);
};
