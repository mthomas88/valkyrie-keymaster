import crypto from "crypto";

export const generate16ByteSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const hex = (buffer: Buffer) => {
  return buffer.toString("hex");
};

const cipher16Byte = (masterkey: Buffer) => {
  return crypto.createCipheriv("aes-256-cbc", masterkey, Buffer.alloc(16));
};

const decipher16Byte = (masterkey: Buffer) => {
  return crypto.createDecipheriv("aes-256-cbc", masterkey, Buffer.alloc(16));
};

/**
 * Generate a new master key buffer.
 * @param options - Options for generating the master key.
 * @param options.salt - The salt to use for key derivation. Defaults to a new 16-byte salt.
 * @returns Master key buffer.
 */
export const generateMasterKey = (options: { salt?: string } = {}) => {
  const salt = options.salt || generate16ByteSalt();
  const bytes = crypto.randomBytes(32);
  const derivedKey = crypto.pbkdf2Sync(bytes, salt, 100000, 32, "sha512");

  return Buffer.from(derivedKey);
};

/**
 * Encrypt data using a provided master key.
 * @param options - Options for encrypting the data.
 * @param options.data - The data to encrypt.
 * @param options.key - The master key to use for encryption.
 * @returns The encrypted data as a Buffer.
 */
export const encryptClientData = (options: { data: Buffer; key: Buffer }) => {
  const { data, key } = options;
  const cipher = cipher16Byte(key);

  return Buffer.concat([
    Buffer.from(cipher.update(data.toString(), "utf8", "base64")),
    Buffer.from(cipher.final("base64")),
  ]);
};

/**
 * Decrypt data using a provided master key.
 * @param options - Options for decrypting the data.
 * @param options.encryptedData - The encrypted data to decrypt.
 * @param options.key - The master key to use for decryption.
 * @returns The decrypted data as a Buffer.
 */
export const decryptClientData = (options: {
  encryptedData: Buffer;
  key: Buffer;
}) => {
  const { encryptedData, key } = options;
  const decipher = decipher16Byte(key);

  return Buffer.concat([
    Buffer.from(decipher.update(encryptedData.toString(), "base64", "utf8")),
    Buffer.from(decipher.final("utf8")),
  ]);
};
