import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  decryptClientData,
  encryptClientData,
  generateMasterKey,
  hex,
} from ".";

describe("encrypt/decrypt aes-256-cbc", () => {
  let data = Buffer.from("123456789abcdefghijklmnopqrstuvwxyz");
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("is able to encrypt a buffer and decrpyt it to match the original", () => {
    const masterKey = generateMasterKey();
    const encrypted = encryptClientData(data, masterKey);
    expect(hex(decryptClientData(encrypted, masterKey))).toBe(hex(data));
  });

  it("encrypts data when given a key and a data buffer", () => {
    const masterKey = generateMasterKey();
    expect(hex(data)).not.toBe(hex(encryptClientData(data, masterKey)));
  });
});
