import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  decryptClientData,
  encryptClientData,
  generate16ByteSalt,
  generateMasterKey,
  hex,
} from "./crypt";

describe("encrypt/decrypt aes-256-cbc", () => {
  let data = Buffer.from("123456789abcdefghijklmnopqrstuvwxyz");
  let key: Buffer = Buffer.from("");

  beforeAll(() => {
    key = generateMasterKey();
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("generate16ByteSalt", () => {
    it("should generate a 16-byte salt", () => {
      const salt = generate16ByteSalt();
      expect(salt.length).toBe(32); // 16 bytes in hex
    });

    it("should generate different salts on each call", () => {
      const salt1 = generate16ByteSalt();
      const salt2 = generate16ByteSalt();
      expect(salt1).not.toBe(salt2);
    });
  });

  describe("hex", () => {
    it("should convert a Buffer to a hex string", () => {
      const buffer = Buffer.from("hello");
      const hexString = hex(buffer);
      expect(hexString).toBe("68656c6c6f");
    });
  });

  describe("generateMasterKey", () => {
    it("should generate a 32-byte master key", () => {
      const masterKey = generateMasterKey();
      expect(masterKey.length).toBe(32);
    });

    it("should use a provided salt", () => {
      const salt = "my-salt";
      const masterKey = generateMasterKey({ salt });
      expect(masterKey).not.toBe(generateMasterKey()); // Ensure salt is used
    });

    it("should use a provided salt to restore the same master key", () => {
      const salt = "my-salt";
      const masterKey1 = generateMasterKey({ salt });
      const masterKey2 = generateMasterKey({ salt });
      expect(masterKey1).toEqual(masterKey2); // Ensure salt is used
    });
  });

  describe("encryptClientData", () => {
    it("should encrypt and decrypt data correctly", () => {
      const masterKey = generateMasterKey();
      const data = Buffer.from("Hello, world!");
      const encryptedData = encryptClientData({ data, key: masterKey });
      const decryptedData = decryptClientData({
        data: encryptedData,
        key: masterKey,
      });
      expect(decryptedData.toString()).toBe("Hello, world!");
    });
  });

  it("is able to encrypt a buffer and decrpyt it to match the original", () => {
    expect(
      hex(
        decryptClientData({
          data: encryptClientData({ data, key }),
          key,
        }),
      ),
    ).toBe(hex(data));
  });

  it("encrypts data when given a key and a data buffer", () => {
    expect(hex(data)).not.toBe(hex(encryptClientData({ data, key })));
  });
});
