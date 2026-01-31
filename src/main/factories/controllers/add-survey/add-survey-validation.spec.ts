import {
  RequiredFields,
  ValidationComposite,
} from "../../../../validation/validators";
import { Validation } from "../../../../presentation/protocols/validation";
import { makeAddSurveyValidation } from "./add-survey-validation";

jest.mock("../../../../validation/validators/validation-composite");

describe("Add Survey Validation Factory", () => {
  test("Should call ValidationComposite with all validations ", async () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ["question", "answers"]) {
      validations.push(new RequiredFields(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
