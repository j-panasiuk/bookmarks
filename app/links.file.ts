import { type Bookmark } from "./bookmarks.types";

export function getLinksFileContent(bookmarks: Bookmark[]): string {
  return bookmarks.map((b) => b.href).join("\n");
}
