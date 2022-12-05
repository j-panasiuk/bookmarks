import { join } from "path";
import { readFile } from "~/utils/file";

export async function readBookmarksFile(): Promise<string> {
  const path = getFilePath();
  const html = await readFile(path);
  return html;
}

const DEFAULT_PATH = "../example/bookmarks.html";

function getFilePath(): string {
  return process.env.BOOKMARKS_FILE_PATH || join(__dirname, DEFAULT_PATH);
}
