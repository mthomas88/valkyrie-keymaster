import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  decryptClientData,
  encryptClientData,
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

  it("is able to encrypt a buffer and decrpyt it to match the original", () => {
    expect(
      hex(
        decryptClientData({
          encryptedData: encryptClientData({ data, key }),
          key,
        })
      )
    ).toBe(hex(data));
  });

  it("encrypts data when given a key and a data buffer", () => {
    expect(hex(data)).not.toBe(hex(encryptClientData({ data, key })));
  });
});
