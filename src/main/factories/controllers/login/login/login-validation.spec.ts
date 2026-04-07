import { makeLoginValidation } from "./login-validation";

import { EmailValidator } from "@/presentation/protocols";
import {
  RequiredFields,
  EmailValidation,
  ValidationComposite,
} from "@/validation/validators";
import { Validation } from "@/presentation/protocols/validation";
import { mockEmailValidator } from "@/validation/tests/mock-email-validator";

jest.mock("@/validation/validators/validation-composite");

describe("Login Validation Factory", () => {
  test("Should call ValidationComposite with all validations ", async () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFields(field));
    }

    validations.push(new EmailValidation(mockEmailValidator(), "email"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
