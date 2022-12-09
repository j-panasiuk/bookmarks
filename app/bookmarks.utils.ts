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
 * isSameAs(b['/A'])(b['/A']) // true
 * isSameAs(b['/A'])(A_) // false (different folders, same name)
 * isSameAs(b['/A'])(b['/B']) // false
 * isSameAs(b['/A'])(A/B) // false
 * isSameAs(b['/A'])(B/A) // false
 */
export const isSameAs: Eq2<Item> = (item1) => (item2) => {
  return getDerivedId(item1) === getDerivedId(item2);
};

/**
 * Check if the second item is inside the first folder.
 * A folder is not considered to be inside itself :)
 * Works for folders and bookmarks.
 * @example
 * isInside(f['/A'])(b['/B']) // false
 * isInside(f['/A'])(b['/A']) // false
 * isInside(f['/A'])(A/1) // true
 * isInside(f['/A'])(A/1/a) // true
 * isInside(A_)(A/1/a) // false (different folder, same name)
 */
export const isInside =
  (folder: Folder) =>
  (item: Item): boolean => {
    return getParentFolderPath(item).startsWith(getItemPath(folder));
  };

// --- TESTS ---

// @ts-ignore
if (import.meta.vitest) {
  // @ts-ignore
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

  describe("isInside", () => {
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
}
