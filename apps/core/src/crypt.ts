import crypto from "crypto";

export const generate16ByteSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const hex = (buf: Buffer) => {
  return buf.toString("hex");
};

const cipher16Byte = (key: Buffer) => {
  return crypto.createCipheriv("aes-256-cbc", key, Buffer.alloc(16));
};

const decipher16Byte = (key: Buffer) => {
  return crypto.createDecipheriv("aes-256-cbc", key, Buffer.alloc(16));
};

/**
 * Generate a new master key buffer.
 * @param opts - Options for generating the master key.
 * @param opts.salt - The salt to use for key derivation. Defaults to a new 16-byte salt.
 * @returns Master key buffer.
 */
export const generateMasterKey = (opts: { salt?: string } = {}) => {
  const salt = opts?.salt || "default-salt";
  const hash = crypto.createHash("sha256");
  hash.update(salt);
  return Buffer.from(hash.digest());
};

/**
 * Encrypt data using a provided master key.
 * @param opts - Options for encrypting the data.
 * @param opts.data - The data to encrypt.
 * @param opts.key - The master key to use for encryption.
 * @returns The encrypted data as a Buffer.
 */
export const encryptClientData = ({
  data,
  key,
}: {
  data: Buffer;
  key: Buffer;
}) => {
  const cipher = cipher16Byte(key);

  return Buffer.concat([
    Buffer.from(cipher.update(data.toString(), "utf8", "base64")),
    Buffer.from(cipher.final("base64")),
  ]);
};

/**
 * Decrypt data using a provided master key.
 * @param opts - Options for decrypting the data.
 * @param opts.data - The encrypted data to decrypt.
 * @param opts.key - The master key to use for decryption.
 * @returns The decrypted data as a Buffer.
 */
export const decryptClientData = ({
  key,
  data,
}: {
  data: Buffer;
  key: Buffer;
}) => {
  const decipher = decipher16Byte(key);

  return Buffer.concat([
    Buffer.from(decipher.update(data.toString(), "base64", "utf8")),
    Buffer.from(decipher.final("utf8")),
  ]);
};
