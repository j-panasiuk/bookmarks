import { readFile as readFileAsync } from "fs/promises";

export async function readFile(path: string): Promise<string> {
  return readFileAsync(path, { encoding: "utf-8" });
}
