import type { Bookmark, Folder, Item } from "./bookmarks.types";
import { map } from "~/utils/object";
import { MapFn } from "./utils/fn";

type PartialItem = Omit<Item, "addDate">;

const folderItems: Record<string, PartialItem> = {
  "/A": { parentFolders: [], title: "A" },
  "/A/A": { parentFolders: ["A"], title: "A" },
  "/A/A/A": { parentFolders: ["A", "A"], title: "A" },
  "/A/B": { parentFolders: ["A"], title: "B" },
  "/A_": { parentFolders: [], title: "A" },
  "/B": { parentFolders: [], title: "B" },
  "/C": { parentFolders: [], title: "C" },
  "/C/A": { parentFolders: ["C"], title: "A" },
};

const bookmarkItems: Record<string, PartialItem> = {
  "/a": { parentFolders: [], title: "A" },
  "/A/a": { parentFolders: ["A"], title: "A" },
  "/A/A/a": {
    parentFolders: ["A", "A"],
    title: "A",
  },
  "/A/A/A/a": {
    parentFolders: ["A", "A", "A"],
    title: "A",
  },
  "/A_/a": {
    parentFolders: ["A" /** TODO that's different folder! */],
    title: "A",
  },
  "/B/a": { parentFolders: ["B"], title: "A" },
};

const toFolder: MapFn<PartialItem, Folder> = (folder, i) => ({
  ...folder,
  addDate: getFolderTimestamp(i),
  children: [],
});
const toBookmark: MapFn<PartialItem, Bookmark> = (bookmark, i) => ({
  ...bookmark,
  addDate: getBookmarkTimestamp(i),
  href: `#/${bookmark.title}`,
  icon: null,
});

// Generate non-overlapping timestamps
const getFolderTimestamp = (i: number) => 1.6e12 + 2 * i;
const getBookmarkTimestamp = (i: number) => 1.6e12 + 2 * i + 1;

export const folders = map(folderItems, toFolder);
export const bookmarks = map(bookmarkItems, toBookmark);
