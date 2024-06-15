import fs from "fs/promises";
import {
  generate16ByteSalt,
  encryptClientData,
  hex,
  decryptClientData,
  generateMasterKey,
} from "./crypt";

const createFileData = (opts: { salt: string; cipertext: string }) => ({
  ...opts,
});

/**
 *  Encrypt data to a file on the system.
 * @param opts - Options for encrypting data to a file.
 * @param opts.data - The data to encrypt.
 * @param opts.filePath - The path to the file to save the encrypted data.
 * @param opts.key - The master key to use for encryption.
 */
export const encryptToFile = async ({
  data,
  filePath,
  key,
}: {
  data: unknown;
  filePath: string;
  key: Buffer;
}) => {
  const salt = generate16ByteSalt();

  const encryptedData = encryptClientData({
    data: Buffer.from(JSON.stringify(data)),
    key,
  });

  await fs.writeFile(
    filePath,
    JSON.stringify(
      createFileData({
        salt,
        cipertext: hex(encryptedData),
      }),
    ),
  );
};

/**
 * Decrypt data from a file on the system.
 * @param opts - Options for decrypting data from a file.
 * @param opts.filePath - The path to the file containing the encrypted data.
 * @param opts.masterKey - The master key to use for decryption.
 * @returns The decrypted data as a string.
 */
export const decryptFromFile = async ({
  filePath,
  key,
}: {
  filePath: string;
  key?: Buffer;
}) => {
  const buffer = await fs.readFile(filePath, "utf-8");

  const fileContents = JSON.parse(buffer) as ReturnType<typeof createFileData>;

  return decryptClientData({
    data: Buffer.from(fileContents.cipertext, "hex"),
    key: key ?? generateMasterKey({ salt: fileContents.salt }),
  }).toString("utf8");
};
