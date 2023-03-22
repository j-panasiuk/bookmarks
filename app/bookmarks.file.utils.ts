import { AssertionError } from "~/utils/assert";

export const UPLOAD_FOLDER = "/files/uploaded";
export const FILE_EXTENSION = ".html";
export const FILE_TYPE = "text/html";
export const FILE_DOCTYPE = "<!DOCTYPE NETSCAPE-Bookmark-file-1>";
export const EXAMPLE_FILE_NAME = "bookmarks_example.html" satisfies FileName;

export type FolderPath = `${string}${typeof UPLOAD_FOLDER}`;
export type FileName = `${string}${typeof FILE_EXTENSION}`;
export type FilePath = `${string}${typeof UPLOAD_FOLDER}/${FileName}`;
export type FileContent = `${typeof FILE_DOCTYPE}${string}`;

export function isFilePath(val: string): val is FilePath {
  return val.split(UPLOAD_FOLDER)?.[1]?.endsWith(FILE_EXTENSION);
}

export function isFileName(val: string): val is FileName {
  return (
    !val.includes("/") &&
    val.endsWith(FILE_EXTENSION) &&
    val.length > FILE_EXTENSION.length
  );
}

export function isFileContent(val: string): val is FileContent {
  return val.startsWith(FILE_DOCTYPE);
}

export function assertFile(val: unknown): asserts val is File {
  if (!(val instanceof File) || val.type !== FILE_TYPE)
    throw new AssertionError(assertFile.name, val);
}

export function assertFileName(val: unknown): asserts val is FileName {
  if (typeof val !== "string" || !isFileName(val))
    throw new AssertionError(assertFileName.name, val);
}

export function assertFileContent(val: unknown): asserts val is FileContent {
  if (typeof val !== "string" || !isFileContent(val))
    throw new AssertionError(assertFileContent.name, val);
}

export function withoutExtension(fileName: FileName): string {
  return fileName.replace(FILE_EXTENSION, "");
}

export function withExtension(name: string): FileName {
  return `${name}${FILE_EXTENSION}`;
}
