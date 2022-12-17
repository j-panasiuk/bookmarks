import type { Bookmark, Folder } from "./bookmarks.types";

declare global {
  var cache: Cache | undefined;
}

type Cache = Partial<{
  fileName: string;
  html: string;
  bookmarks: Bookmark[];
  folders: Folder<Folder>[];
}>;

export const cache = (() => {
  const cache = global.cache;
  if (!cache) {
    return (global.cache = {});
  }
  return cache;
})();
