import type { Bookmark, Folder, Item } from "./bookmarks.types";
import type { Eq2 } from "./utils/fn";
import { folders as f, bookmarks as b } from "~/bookmarks.mock";

export function isFolder(val: Item): val is Folder {
  return "children" in val && Array.isArray(val.children);
}

export function isBookmark(val: Item): val is Bookmark {
  return "href" in val && typeof val.href === "string";
}

function getDerivedId(val: Item): string {
  return `${getItemPath(val)}_${val.addDate}`;
}

export function getItemPath(item: Item): string {
  return joinPath(item.parentFolders.concat(item.title));
}

function getParentFolderPath(item: Item): string {
  return joinPath(item.parentFolders);
}

export function getFolderLevel(folder: Folder): number {
  return folder.parentFolders.length;
}

export function joinPath(paths: string[]): string {
  return paths.join("/");
}

/**
 * Check if the second item is the same as the first one.
 * Compare by derived ids to tell apart bookmarks/folders with same names.
 * Works for folders and bookmarks.
 * @example
 * isSameAs(A)(A) // true
 * isSameAs(A)(A_) // false (different folders, same name)
 * isSameAs(A)(B) // false
 * isSameAs(A)(A/B) // false
 * isSameAs(A)(B/A) // false
 */
export const isSameAs: Eq2<Item> = (item1) => (item2) => {
  return getDerivedId(item1) === getDerivedId(item2);
};

/**
 * Check if the second item is inside the first folder.
 * By default include all subfolders.
 * (To change this setting use `includeSubfolders = false`).
 * Works for folders and bookmarks.
 * @example
 * isInside(A)(A/A) // true
 * isInside(A)(A/A/A) // true
 * isInside(A)(A) // false (a folder is not inside itself)
 * isInside(A)(B) // false (different folder)
 * isInside(A_)(A/A/A) // false (same name, but different folder)
 * isInside(A, false)(A/A/A) // false (ignore subfolders)
 */
export const isInside =
  (folder: Folder, includeSubfolders: boolean = true) =>
  (item: Item): boolean => {
    return includeSubfolders
      ? getParentFolderPath(item).startsWith(getItemPath(folder))
      : getParentFolderPath(item) === getItemPath(folder);
  };

// --- TESTS ---

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("isSameAs", () => {
    it("returns true if given the same folder (compare by location and title)", () => {
      expect(isSameAs(f["/A"])({ ...f["/A"] })).toBe(true);
      expect(isSameAs(f["/A"])({ ...f["/A"], children: [777] } as Folder)).toBe(
        true
      );
      expect(isSameAs(f["/A"])(f["/B"])).toBe(false);
      expect(isSameAs(f["/A"])(f["/A/A"])).toBe(false);
      expect(isSameAs(f["/A/A"])(f["/A/B"])).toBe(false);
      expect(isSameAs(f["/A/A"])(f["/A/A/A"])).toBe(false);
    });
    it("returns true if given the same file (compare by location and title)", () => {
      expect(isSameAs(b["/a"])({ ...b["/a"] })).toBe(true);
      expect(isSameAs(b["/a"])({ ...b["/a"], href: "#zzz" } as Bookmark)).toBe(
        true
      );
      expect(isSameAs(b["/a"])(b["/A/a"])).toBe(false);
      expect(isSameAs(b["/a"])(b["/A/A/a"])).toBe(false);
      expect(isSameAs(b["/a"])(b["/A/A/A/a"])).toBe(false);
    });
  });

  describe("isInside (include subfolders)", () => {
    it("returns true if second folder is inside first folder", () => {
      expect(isInside(f["/A"])(f["/A"])).toBe(false);
      expect(isInside(f["/A"])(f["/B"])).toBe(false);
      expect(isInside(f["/A"])(f["/A/A"])).toBe(true);
      expect(isInside(f["/A/A"])(f["/A/B"])).toBe(false);
      expect(isInside(f["/A/A"])(f["/A/A/A"])).toBe(true);
    });
    it("returns true if second bookmark is inside first folder", () => {
      expect(isInside(f["/A"])(b["/a"])).toBe(false);
      expect(isInside(f["/A"])(b["/A/a"])).toBe(true);
      expect(isInside(f["/A"])(b["/A/A/a"])).toBe(true);
      expect(isInside(f["/A"])(b["/A/A/A/a"])).toBe(true);
      expect(isInside(f["/A/A"])(b["/a"])).toBe(false);
      expect(isInside(f["/A/A"])(b["/A/a"])).toBe(false);
      expect(isInside(f["/A/A"])(b["/A/A/a"])).toBe(true);
      expect(isInside(f["/A/A"])(b["/A/A/A/a"])).toBe(true);
      expect(isInside(f["/A/A/A"])(b["/a"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/a"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/A/a"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/A/A/a"])).toBe(true);
      expect(isInside(f["/B"])(b["/a"])).toBe(false);
    });
  });

  describe("isInside (no subfolders)", () => {
    it("returns true if second folder is inside first folder", () => {
      expect(isInside(f["/A"], false)(f["/A"])).toBe(false);
      expect(isInside(f["/A"], false)(f["/B"])).toBe(false);
      expect(isInside(f["/A"], false)(f["/A/A"])).toBe(true);
      expect(isInside(f["/A/A"], false)(f["/A/B"])).toBe(false);
      expect(isInside(f["/A/A"], false)(f["/A/A/A"])).toBe(true);
    });
    it("returns true if second bookmark is inside first folder", () => {
      expect(isInside(f["/A"], false)(b["/a"])).toBe(false);
      expect(isInside(f["/A"], false)(b["/A/a"])).toBe(true);
      expect(isInside(f["/A"], false)(b["/A/A/a"])).toBe(false);
      expect(isInside(f["/A"], false)(b["/A/A/A/a"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/a"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/A/a"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/A/A/a"])).toBe(true);
      expect(isInside(f["/A/A"], false)(b["/A/A/A/a"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/a"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/a"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/A/a"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/A/A/a"])).toBe(true);
      expect(isInside(f["/B"], false)(b["/a"])).toBe(false);
    });
  });
}
