import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { generateMasterKey } from "./crypt";
import { encryptToFile, decryptFromFile } from "./file";
import fs from "fs";

const BUFFER_SIZE = 1024 * 1024; // 1MB

describe("File Encryption and Decryption Performance", () => {
  let data: Buffer;
  let key: Buffer;
  const testFilePath = "benchmark.json";

  beforeAll(() => {
    data = Buffer.from("123456789abcdefghijklmnopqrstuvwxyz".repeat(500)); // Large data buffer
    key = generateMasterKey();
  });

  afterAll(() => {
    try {
      fs.unlinkSync(testFilePath);
    } catch (err) {
      // ignore
    }
  });

  it("should encrypt and decrypt a large file within a reasonable time", async () => {
    const startTime = Date.now();
    await encryptToFile({
      data: data.subarray(),
      filePath: testFilePath,
      key,
    });
    const encryptionTime = Date.now() - startTime;
    console.log(`Encryption time: ${encryptionTime}ms`);

    const startTime2 = Date.now();
    const decryptedData = await decryptFromFile({
      filePath: testFilePath,
      key,
    });
    const decryptionTime = Date.now() - startTime2;
    console.log(`Decryption time: ${decryptionTime}ms`);

    // Compare the decrypted data with the original data
    expect(decryptedData).toEqual(JSON.stringify(data)); // Use slice() to create a copy for comparison

    // You can add assertions here to check if the times are within acceptable limits
    // for your application. For example:
    // expect(encryptionTime).toBeLessThan(1000); // Encryption should take less than 1 second
    // expect(decryptionTime).toBeLessThan(500); // Decryption should take less than 500ms
  });
});
