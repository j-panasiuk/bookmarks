import { join } from "path";
import { existsSync } from "fs";
import { readdir } from "fs/promises";

export async function getBookmarksFilePath(): Promise<string | undefined> {
  const filePathFromEnv = process.env.BOOKMARKS_FILE_PATH;
  if (filePathFromEnv && existsSync(filePathFromEnv)) {
    return filePathFromEnv;
  }

  const files = await readdir(join(__dirname, PATH_TO_IMPORTS));
  const file = files.find(
    (f) => f.endsWith(".html") && !f.endsWith(".example.html")
  );
  if (file) {
    const filePathFromImports = join(__dirname, PATH_TO_IMPORTS, file);
    if (existsSync(filePathFromImports)) {
      return filePathFromImports;
    }
  }
}

const PATH_TO_IMPORTS = "../imports";
