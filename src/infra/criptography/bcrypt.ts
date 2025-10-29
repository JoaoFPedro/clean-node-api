import { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";

export class BCrypterAdapter implements Encrypter {
  salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
