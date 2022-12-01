import { join } from "path";
import { readFile as readFileAsync } from "fs/promises";

export async function readFile(path: string): Promise<string> {
  return readFileAsync(path, { encoding: "utf-8" });
}

const DEFAULT_PATH = "../example/bookmarks.html";

export function getFilePath(): string {
  return process.env.BOOKMARKS_FILE_PATH || join(__dirname, DEFAULT_PATH);
}
