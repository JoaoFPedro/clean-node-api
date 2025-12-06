import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

export class BCrypterAdapter implements Hasher {
  salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
