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


export function getFilePath(): string {
  return process.env.BOOKMARKS_FILE_PATH || join(__dirname, DEFAULT_PATH);
}
