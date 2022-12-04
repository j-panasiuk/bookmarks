import type { Eq2 } from "~/utils/fn";

export type BookmarkTree = (BookmarkFolder | Bookmark)[];

export type BookmarkFolder = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian"]
   * */
  parentFolders: string[];
  title: string;
  children: BookmarkTree;
};

export type Bookmark = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian", "pizza"]
   * */
  parentFolders: string[];
  title: string;
  href: string;
  /** Base 64 icon data */
  icon: string | null;
};

/**
 * A flexible folder type. Can be nested.
 * Parameter `T` specifies what may go inside the folder.
 *
 * @example
 * type FolderNoChildren = Folder<never>;
 * type FolderWithBookmarks = Folder<Bookmark>;
 * type FolderNestedNoFiles = Folder<Folder>;
 * type FolderNestedWithBookmarks = Folder<Folder<Bookmark> | Bookmark>;
 */
export type Folder<T = unknown> = {
  parentFolders: string[];
  title: string;
  children: T[];
};

// Folder or Bookmark
interface Item {
  parentFolders: string[];
  title: string;
}

/**
 * Check if the second item is same as the first one.
 * Compare folder location and names only.
 * Works for folders and bookmarks.
 * @example
 * isSameAs(A)(A) // true
 * isSameAs(A)(B) // false
 * isSameAs(A)(A/B) // false
 * isSameAs(A)(B/A) // false
 */
export const isSameAs: Eq2<Item> = (item1) => (item2) => {
  return getItemPath(item1) === getItemPath(item2);
};

/**
 * Check if the second item is inside the first folder.
 * A folder is not considered to be inside itself :)
 * Works for folders and bookmarks.
 * @example
 * isInside(A)(B) // false
 * isInside(A)(A) // false
 * isInside(A)(A/1) // true
 * isInside(A)(A/1/a) // true
 */
export const isInside =
  (folder: Folder) =>
  (item: Item): boolean => {
    return getParentFolderPath(item).startsWith(getItemPath(folder));
  };

function getItemPath(item: Item): string {
  return getPath(item.parentFolders.concat(item.title));
}

function getParentFolderPath(item: Item): string {
  return getPath(item.parentFolders);
}

export function getPath(paths: string[]): string {
  return paths.join("/");
}
