import { join } from "path";
import { readdir } from "fs/promises";
import { isFilePath } from "~/utils/file";

export async function getBookmarksFilePath(): Promise<string | undefined> {
  const filePathFromEnv = process.env.BOOKMARKS_FILE_PATH;
  if (filePathFromEnv && (await isFilePath(filePathFromEnv))) {
    return filePathFromEnv;
  }

  const files = await readdir(join(__dirname, PATH_TO_IMPORTS));
  const file = files.find(
    (f) => f.endsWith(".html") && !f.endsWith(".example.html")
  );
  if (file) {
    const filePathFromImports = join(__dirname, PATH_TO_IMPORTS, file);
    if (await isFilePath(filePathFromImports)) {
      return filePathFromImports;
    }
  }
}

const PATH_TO_IMPORTS = "../imports";
