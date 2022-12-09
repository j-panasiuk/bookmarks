import type { Bookmark, Folder, Item } from "./bookmarks.types";
import { map } from "~/utils/object";
import { MapFn } from "./utils/fn";

type Incomplete<T extends Item> = Pick<T, "parentFolders" | "title">;

const _folders: Record<string, Incomplete<Folder>> = {
  "/A": { parentFolders: [], title: "A" },
  "/A/A": { parentFolders: ["A"], title: "A" },
  "/A/A/A": { parentFolders: ["A", "A"], title: "A" },
  "/A/B": { parentFolders: ["A"], title: "B" },
  "/A_": { parentFolders: [], title: "A" },
  "/B": { parentFolders: [], title: "B" },
  "/C": { parentFolders: [], title: "C" },
  "/C/A": { parentFolders: ["C"], title: "A" },
};

const _bookmarks: Record<string, Incomplete<Bookmark>> = {
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

const mapFolder: MapFn<Incomplete<Folder>, Folder> = (folder, i) => ({
  ...folder,
  addDate: 1600000000000 + 2 * i,
  children: [],
});
const mapBookmark: MapFn<Incomplete<Bookmark>, Bookmark> = (bookmark, i) => ({
  ...bookmark,
  addDate: 1600000000001 + 2 * i,
  href: `#/${bookmark.title}`,
  icon: null,
});

export const folders = map(_folders, mapFolder);
export const bookmarks = map(_bookmarks, mapBookmark);
