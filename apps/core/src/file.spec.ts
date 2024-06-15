import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { encryptToFile, decryptFromFile } from "./file";
import { generateMasterKey } from "./crypt";
import fs from "fs/promises";

describe("File Encryption and Decryption", () => {
  const testFilePath = "test.json";
  const testData = { message: "Hello, world!" };
  let key: Buffer;

  beforeEach(() => {
    key = generateMasterKey();
  });

  it("should encrypt and decrypt data to a file successfully", async () => {
    await encryptToFile({
      data: testData,
      filePath: testFilePath,
      key,
    });

    const decryptedData = await decryptFromFile({
      filePath: testFilePath,
      key,
    });

    expect(JSON.parse(decryptedData)).toEqual(testData);
  });

  it("should handle empty data", async () => {
    await encryptToFile({
      data: {},
      filePath: testFilePath,
      key,
    });

    const decryptedData = await decryptFromFile({
      filePath: testFilePath,
      key,
    });

    expect(JSON.parse(decryptedData)).toEqual({});
  });

  it("should handle complex data structures", async () => {
    const complexData = {
      nested: {
        array: [1, 2, 3],
        object: {
          key: "value",
        },
      },
    };

    await encryptToFile({
      data: complexData,
      filePath: testFilePath,
      key,
    });

    const decryptedData = await decryptFromFile({
      filePath: testFilePath,
      key,
    });

    expect(JSON.parse(decryptedData)).toEqual(complexData);
  });

  it("should throw an error if the file does not exist", async () => {
    await expect(
      decryptFromFile({
        filePath: "nonexistent.json",
        key,
      }),
    ).rejects.toThrowError();
  });

  it("should throw an error if the file is corrupted", async () => {
    await fs.writeFile(testFilePath, "invalid data");

    await expect(
      decryptFromFile({
        filePath: testFilePath,
        key,
      }),
    ).rejects.toThrowError();
  });

  afterEach(async () => {
    try {
      await fs.unlink(testFilePath);
    } catch (err) {
      // ignore
    }
  });
});
