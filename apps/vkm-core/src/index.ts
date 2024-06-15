import crypto from "crypto";

const generate16ByteSalt = () => {
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

export const generateMasterKey = (salt = generate16ByteSalt()) => {
  const bytes = crypto.randomBytes(32);
  const derivedKey = crypto.pbkdf2Sync(bytes, salt, 100000, 32, "sha512");

  return Buffer.from(derivedKey);
};

export const encryptClientData = (password: Buffer, key: Buffer) => {
  const cipher = cipher16Byte(key);

  let encrypted = cipher.update(password.toString(), "utf8", "base64");

  encrypted += cipher.final("base64");

  return Buffer.from(encrypted);
};

export const decryptClientData = (encryptedData: Buffer, key: Buffer) => {
  const decipher = decipher16Byte(key);

  let decrypted = decipher.update(encryptedData.toString(), "base64", "utf8");

  decrypted += decipher.final("utf8");

  return Buffer.from(decrypted);
};
