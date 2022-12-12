// --- FILES AND FOLDERS ---

/**
 * Bookmark or folder identifier.
 * Consists of item's `title` and  `add_date` timestamp.
 * @example
 * "/A" --> "A+1600000000" // folder A
 * "/A/b" --> "b-1700000000" // bookmark b
 */
export type ItemId = `${string}${"+" | "-"}${string}`;

export interface Item {
  /**
   * Names of parent folders, following the nesting order.
   * @example
   * Folder `/recipes/italian/pizza/` -> ["recipes", "italian"]
   * Link `/recipes/my-favorite-dish.html` -> ["recipes"]
   * */
  parentFolders: ItemId[];
  title: string;
  /**
   * A timestamp.
   *
   * Apart from things like sorting, `addDate` will also be used to tell apart
   * items with same names from each other.
   *
   * Yes, it's possible for two files or folders to have identical name and
   * location. They can also be renamed and moved at any time, so two different
   * folders may be changed to appear exactly the same.
   *
   * @example
   * Folder `/Photos`
   * Folder `/Photos` (added later)
   */
  addDate: number;
}

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
export interface Folder<T = unknown> extends Item {
  children: T[];
}

// --- BOOKMARKS ---

export type BookmarkItem = Bookmark | Folder<BookmarkItem>;
export interface Bookmark extends Item {
  href: string;
  /** Base 64 icon data */
  icon: string | null;
}
