import { Validation } from "../../../../presentation/protocols/validation";
import { RequiredFields } from "../../../../validation/validators/required-field-validation";
import { ValidationComposite } from "../../../../validation/validators/validation-composite";

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["question", "answers"]) {
    validations.push(new RequiredFields(field));
  }

  return new ValidationComposite(validations);
};
