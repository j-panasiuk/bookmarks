import { readFile, writeFile } from "fs/promises";

export async function readTextFile(path: string): Promise<string> {
  return readFile(path, { encoding: "utf-8" });
}

export async function writeTextFile(
  path: string,
  content: string
): Promise<void> {
  return writeFile(path, content);
}
