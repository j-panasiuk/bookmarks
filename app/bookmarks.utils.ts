import type { Bookmark, Folder, Item, ItemId } from "./bookmarks.types";
import type { Eq2 } from "./utils/fn";
import { folders as f, bookmarks as b } from "~/bookmarks.mock";

export function getItemId(val: Pick<Item, "title" | "addDate">): ItemId {
  const _ = val.addDate >= 0 ? "+" : "-";
  return `${val.title}${_}${Math.abs(val.addDate)}`;
}

export function getItemPath(item: Item): string {
  return joinPath(item.parentFolders.concat(getItemId(item)));
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
  return getItemId(item1) === getItemId(item2);
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

/**
 * Check if the second folder contains the first item.
 * By default include all subfolders.
 * (To change this setting use `includeSubfolders = false`).
 * Works for folders and bookmarks.
 * @example
 * contains(A/A)(A) // true
 * contains(A)(A) // false (a folder is not inside itself)
 * contains(A)(B) // false (different folder)
 * contains(A/A)(A_) // false (same name, but different folder)
 * contains(A/A/A, false)(A) // false (ignore subfolders)
 */
export const contains =
  (item: Item, includeSubfolders: boolean = true) =>
  (folder: Folder): boolean => {
    return includeSubfolders
      ? getParentFolderPath(item).startsWith(getItemPath(folder))
      : getParentFolderPath(item) === getItemPath(folder);
  };

export function isTopLevel(item: Item): boolean {
  return item.parentFolders.length === 0;
}

// --- TESTS ---

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("getItemId", () => {
    it("returns a string including `title` and `addDate`", () => {
      expect(getItemId(f["/A"])).toBe("A+65");
      expect(getItemId(f["/B"])).toBe("B+66");
      expect(getItemId(f["/A/A"])).toBe("A+715");
      expect(getItemId(f["/A/A/A"])).toBe("A+7215");
      expect(getItemId(f["/A_"])).toBe("A+160");
      expect(getItemId(f["/A_/A"])).toBe("A+810");
      expect(getItemId(b["/A"])).toBe("A-65");
      expect(getItemId(b["/A/A"])).toBe("A-715");
    });
    it("returns different ids even if two items are named the same", () => {
      expect(getItemId(f["/A"])).not.toEqual(getItemId(f["/A_"]));
      expect(getItemId(f["/A"])).not.toEqual(getItemId(b["/A"]));
      expect(getItemId(f["/A/A"])).not.toEqual(getItemId(f["/A_/A"]));
      expect(getItemId(f["/A/A"])).not.toEqual(getItemId(f["/A/A_"]));
      expect(getItemId(b["/A"])).not.toEqual(getItemId(b["/A_"]));
    });
  });

  describe("getItemPath", () => {
    it("returns item's parent ids joined with items own id", () => {
      expect(getItemPath(f["/A"])).toBe("A+65");
      expect(getItemPath(b["/A"])).toBe("A-65");
      expect(getItemPath(f["/A/A"])).toBe("A+65/A+715");
      expect(getItemPath(f["/A_/A"])).toBe("A+160/A+810");
    });
  });

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
      expect(isSameAs(b["/A"])({ ...b["/A"] })).toBe(true);
      expect(isSameAs(b["/A"])({ ...b["/A"], href: "#zzz" } as Bookmark)).toBe(
        true
      );
      expect(isSameAs(b["/A"])(b["/A/A"])).toBe(false);
      expect(isSameAs(b["/A"])(b["/A/A/A"])).toBe(false);
      expect(isSameAs(b["/A"])(b["/A/A/A/A"])).toBe(false);
    });
    it("returns false if given items with same title but different add timestamps", () => {
      expect(isSameAs(f["/A"])(f["/A_"])).toBe(false);
      expect(isSameAs(f["/A/A"])(f["/A_/A"])).toBe(false);
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
      expect(isInside(f["/A"])(b["/A"])).toBe(false);
      expect(isInside(f["/A"])(b["/A/A"])).toBe(true);
      expect(isInside(f["/A"])(b["/A/A/A"])).toBe(true);
      expect(isInside(f["/A"])(b["/A/A/A/A"])).toBe(true);
      expect(isInside(f["/A/A"])(b["/A"])).toBe(false);
      expect(isInside(f["/A/A"])(b["/A/A"])).toBe(false);
      expect(isInside(f["/A/A"])(b["/A/A/A"])).toBe(true);
      expect(isInside(f["/A/A"])(b["/A/A/A/A"])).toBe(true);
      expect(isInside(f["/A/A/A"])(b["/A"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/A"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/A/A"])).toBe(false);
      expect(isInside(f["/A/A/A"])(b["/A/A/A/A"])).toBe(true);
      expect(isInside(f["/B"])(b["/A"])).toBe(false);
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
      expect(isInside(f["/A"], false)(b["/A"])).toBe(false);
      expect(isInside(f["/A"], false)(b["/A/A"])).toBe(true);
      expect(isInside(f["/A"], false)(b["/A/A/A"])).toBe(false);
      expect(isInside(f["/A"], false)(b["/A/A/A/A"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/A"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/A/A"])).toBe(false);
      expect(isInside(f["/A/A"], false)(b["/A/A/A"])).toBe(true);
      expect(isInside(f["/A/A"], false)(b["/A/A/A/A"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/A"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/A/A"])).toBe(false);
      expect(isInside(f["/A/A/A"], false)(b["/A/A/A/A"])).toBe(true);
      expect(isInside(f["/B"], false)(b["/A"])).toBe(false);
    });
  });

  describe("contains (include subfolders)", () => {
    it("returns true if second folder contains first folder", () => {
      expect(contains(f["/A"])(f["/A"])).toBe(false);
      expect(contains(f["/B"])(f["/A"])).toBe(false);
      expect(contains(f["/A/A"])(f["/A"])).toBe(true);
      expect(contains(f["/A/B"])(f["/A/A"])).toBe(false);
      expect(contains(f["/A/A/A"])(f["/A"])).toBe(true);
      expect(contains(f["/A/A/A"])(f["/A/A"])).toBe(true);
    });
    it("returns true if second folder contains first bookmark", () => {
      expect(contains(b["/A"])(f["/A"])).toBe(false);
      expect(contains(b["/A/A"])(f["/A"])).toBe(true);
      expect(contains(b["/A/A/A"])(f["/A"])).toBe(true);
      expect(contains(b["/A/A/A/A"])(f["/A"])).toBe(true);
      expect(contains(b["/A"])(f["/A/A"])).toBe(false);
      expect(contains(b["/A/A"])(f["/A/A"])).toBe(false);
      expect(contains(b["/A/A/A"])(f["/A/A"])).toBe(true);
      expect(contains(b["/A/A/A/A"])(f["/A/A"])).toBe(true);
      expect(contains(b["/A"])(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A"])(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A/A"])(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A/A/A"])(f["/A/A/A"])).toBe(true);
      expect(contains(b["/A"])(f["/B"])).toBe(false);
    });
  });

  describe("contains (no subfolders)", () => {
    it("returns true if second folder contains first folder", () => {
      expect(contains(f["/A"], false)(f["/A"])).toBe(false);
      expect(contains(f["/B"], false)(f["/A"])).toBe(false);
      expect(contains(f["/A/A"], false)(f["/A"])).toBe(true);
      expect(contains(f["/A/B"], false)(f["/A/A"])).toBe(false);
      expect(contains(f["/A/A/A"], false)(f["/A"])).toBe(false);
      expect(contains(f["/A/A/A"], false)(f["/A/A"])).toBe(true);
    });
    it("returns true if second folder contains first bookmark", () => {
      expect(contains(b["/A"], false)(f["/A"])).toBe(false);
      expect(contains(b["/A/A"], false)(f["/A"])).toBe(true);
      expect(contains(b["/A/A/A"], false)(f["/A"])).toBe(false);
      expect(contains(b["/A/A/A/A"], false)(f["/A"])).toBe(false);
      expect(contains(b["/A"], false)(f["/A/A"])).toBe(false);
      expect(contains(b["/A/A"], false)(f["/A/A"])).toBe(false);
      expect(contains(b["/A/A/A"], false)(f["/A/A"])).toBe(true);
      expect(contains(b["/A/A/A/A"], false)(f["/A/A"])).toBe(false);
      expect(contains(b["/A"], false)(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A"], false)(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A/A"], false)(f["/A/A/A"])).toBe(false);
      expect(contains(b["/A/A/A/A"], false)(f["/A/A/A"])).toBe(true);
      expect(contains(b["/A"], false)(f["/B"])).toBe(false);
    });
  });
}
