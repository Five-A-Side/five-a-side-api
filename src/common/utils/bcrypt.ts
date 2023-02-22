import * as bcrypt from 'bcrypt';

export class Bcrypt {
  /**
   * Encodes the given raw password using the bcrypt library
   * @param {string} rawPassword - The password to be encoded
   * @returns {Promise<string>} A promise that resolves to the encoded password
   */
  encodePassword = async (rawPassword: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(rawPassword, salt);
  };

  /**
   * Compares the given raw password with the encoded password (hash)
   * @param {string} rawPassword - The password to be compared.
   * @param {string} hash - The encoded password to compare with
   * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise
   */
  comparePassword = async (
    rawPassword: string,
    hash: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(rawPassword, hash);
  };
}
