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
