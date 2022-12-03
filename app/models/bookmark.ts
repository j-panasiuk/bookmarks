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

/**
 * Check if the second folder is same as the first one.
 * Compare folder location and names only.
 * @example
 * isSameAs(A)(A) // true
 * isSameAs(A)(B) // false
 * isSameAs(A)(A/B) // false
 * isSameAs(A)(B/A) // false
 */
export const isSameAs =
  (f1: Folder) =>
  (f2: Folder): boolean => {
    return getFolderPath(f1) === getFolderPath(f2);
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
  (item: { parentFolders: string[] }): boolean => {
    return getParentFolderPath(item).startsWith(getFolderPath(folder));
  };

function getFolderPath(folder: Folder): string {
  return getPath(folder.parentFolders.concat(folder.title));
}

function getParentFolderPath(item: { parentFolders: string[] }): string {
  return getPath(item.parentFolders);
}

export function getPath(paths: string[]): string {
  return paths.join("/");
}
