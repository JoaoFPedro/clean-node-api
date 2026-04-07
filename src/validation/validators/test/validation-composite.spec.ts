import { mockValidationStub } from "@/validation/tests/mock-email-validator";
import { MissingParamError } from "../../../presentation/erros";
import { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../validation-composite";

interface SutType {
  sut: ValidationComposite;
  validationStubs: Validation[];
}
const makeSut = (): SutType => {
  const validationStubs = [mockValidationStub(), mockValidationStub()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};
describe("Validation Composite", () => {
  test("Should return  an error if validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate([{ field: "any_value" }]);

    expect(error).toEqual(new MissingParamError("field"));
  });
  test("Should return the first error if more than one validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate([{ field: "any_value" }]);

    expect(error).toEqual(new Error());
  });
  test("Should not return an error if succeed", () => {
    const { sut } = makeSut();

    const error = sut.validate([{ field: "any_value" }]);

    expect(error).toBeFalsy();
  });
});
