import bcrypt from "bcrypt";
import { BCrypter } from "./bcrypt";
describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const sut = new BCrypter(12);
    const encryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(encryptSpy).toHaveBeenCalledWith("any_value", 12);
  });
});
