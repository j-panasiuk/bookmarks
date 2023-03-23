import { join } from "path";
import { readdir, stat } from "fs/promises";
import { readTextFile, writeTextFile } from "~/utils/file";
import {
  type FileName,
  type FilePath,
  type FileContent,
  type FolderPath,
  UPLOAD_FOLDER,
  EXAMPLE_FILE_NAME,
  isFileName,
  assertFileContent,
  assertFileName,
} from "./bookmarks.file.utils";
import { log, logWarning } from "./utils/console";

export async function getMostRecentFileName(): Promise<FileName | undefined> {
  const fileNames = await getUploadedFileNames();

  let mostRecent: FileName | undefined;
  let mostRecentTime: number | undefined;

  for (const fileName of fileNames) {
    try {
      const filePath = getUploadedFilePath(fileName);
      const { mtimeMs } = await stat(filePath);
      if (mostRecentTime === undefined || mostRecentTime < mtimeMs) {
        mostRecent = fileName;
        mostRecentTime = mtimeMs;
      }
    } catch {
      logWarning("Failed to read file", fileName);
    }
  }

  return mostRecent;
}

export async function readFileContent(
  fileName: FileName
): Promise<FileContent> {
  const filePath =
    fileName === EXAMPLE_FILE_NAME
      ? getExampleFilePath()
      : getUploadedFilePath(fileName);

  const fileContent = await readTextFile(filePath);
  assertFileContent(fileContent);

  return fileContent;
}

export async function saveFile(file: File) {
  assertFileName(file.name);

  const filePath = getUploadedFilePath(file.name);
  const fileContent = await file.text();
  assertFileContent(fileContent);

  log("saving to file", filePath);
  return await writeTextFile(filePath, fileContent);
}

// --- FILE SYSTEM HELPERS ---

function getUploadedFolderPath() {
  return join(__dirname, "..", UPLOAD_FOLDER) as FolderPath;
}

function getUploadedFilePath(fileName: FileName) {
  const folderPath = getUploadedFolderPath();
  return `${folderPath}/${fileName}` as FilePath;
}

export async function getUploadedFileNames() {
  const folderPath = getUploadedFolderPath();
  const names = await readdir(folderPath);
  return names.filter(isFileName);
}

function getExampleFilePath() {
  return join(__dirname, "..", "files", EXAMPLE_FILE_NAME);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("upload folder", () => {
    it("exists in expected location", async () => {
      const folderPath = getUploadedFolderPath();
      const folderStat = await stat(folderPath);
      const isDirectory = await folderStat.isDirectory();
      expect(isDirectory).toBe(true);
    });
  });

  describe("example file", () => {
    it("exists in upload folder", async () => {
      const filePath = getExampleFilePath();
      const fileStat = await stat(filePath);
      const isFile = await fileStat.isFile();
      expect(isFile).toBe(true);
    });
  });
}
