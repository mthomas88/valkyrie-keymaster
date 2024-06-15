import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  decryptClientData,
  encryptClientData,
  generateMasterKey,
  hex,
} from ".";

describe("encrypt/decrypt", () => {
  let data = Buffer.from("123456789abcdefghijklmnopqrstuvwxyz");
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("can reliably encrypt and decrypt data", () => {
    const masterKey = generateMasterKey();
    const encrypted = encryptClientData(data, masterKey);
    expect(hex(decryptClientData(encrypted, masterKey))).toBe(hex(data));
  });

  it("is encrypting data", () => {
    const masterKey = generateMasterKey();
    expect(hex(data)).not.toBe(hex(encryptClientData(data, masterKey)));
  });
});
