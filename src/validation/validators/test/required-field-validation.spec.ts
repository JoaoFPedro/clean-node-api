import { MissingParamError } from "../../../presentation/erros";
import { RequiredFields } from "../required-field-validation";

const makeSut = (): RequiredFields => {
  return new RequiredFields("any_field");
};
describe("Required Field Validation", () => {
  test("Should return  MissingParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ name: "any_name" });

    expect(error).toEqual(new MissingParamError("any_field"));
  });

  test("Should return  MissingParamError if validation fails", () => {
    const sut = makeSut();
    const request = sut.validate({ any_field: "any_field" });

    expect(request).toBeFalsy();
  });
});
