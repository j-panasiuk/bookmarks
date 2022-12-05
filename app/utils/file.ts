import { readFile as readFileAsync, writeFile } from "fs/promises";

export async function readFile(path: string): Promise<string> {
  return readFileAsync(path, { encoding: "utf-8" });
}

export async function writeTextFile(
  path: string,
  content: string
): Promise<void> {
  return writeFile(path, content);
}
