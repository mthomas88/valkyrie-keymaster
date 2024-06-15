import fs from "fs/promises";
import {
  generate16ByteSalt,
  encryptClientData,
  hex,
  decryptClientData,
  generateMasterKey,
} from "./crypt";

const createFileData = (args: { salt: string; cipertext: string }) => ({
  ...args,
});

/**
 *  Encrypt data to a file on the system.
 * @param options - Options for encrypting data to a file.
 * @param options.data - The data to encrypt.
 * @param options.filePath - The path to the file to save the encrypted data.
 * @param options.masterKey - The master key to use for encryption.
 */
export const encryptToFile = async (options: {
  data: unknown;
  filePath: string;
  masterKey: Buffer;
}) => {
  const { data, filePath, masterKey } = options;
  const salt = generate16ByteSalt();

  const encryptedData = encryptClientData({
    data: Buffer.from(JSON.stringify(data)),
    key: masterKey,
  });

  const encryptedFile = createFileData({
    salt,
    cipertext: hex(encryptedData),
  });

  await fs.writeFile(filePath, JSON.stringify(encryptedFile));
};

/**
 * Decrypt data from a file on the system.
 * @param options - Options for decrypting data from a file.
 * @param options.filePath - The path to the file containing the encrypted data.
 * @param options.masterKey - The master key to use for decryption.
 * @returns The decrypted data as a string.
 */
export const decryptFromFile = async (options: {
  filePath: string;
  masterKey?: Buffer;
}) => {
  const { filePath, masterKey } = options;
  const buffer = await fs.readFile(filePath, "utf-8");

  const fileContents = JSON.parse(buffer) as ReturnType<typeof createFileData>;

  return decryptClientData({
    encryptedData: Buffer.from(fileContents.cipertext, "hex"),
    key: masterKey ? masterKey : generateMasterKey({ salt: fileContents.salt }),
  }).toString("utf8");
};
