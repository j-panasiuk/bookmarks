export type BookmarkTree = (BookmarkFolder | Bookmark)[];

export type BookmarkFolder = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian"]
   * */
  folders: string[];
  title: string;
  children: BookmarkTree;
};

export type Bookmark = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian", "pizza"]
   * */
  folders: string[];
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
  folders: string[];
  title: string;
  children: T[];
};
