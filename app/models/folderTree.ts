import { by, splitBy } from "~/utils/array";
import type { Folder } from "./bookmark";

/**
 * Given flat folder list return a tree structure.
 * @example
 * buildTree([ A, B, A1, A1a ]) // [ A [ A1 [ A1a ] ], B ]
 */
export function buildTree(folders: Folder[], level = 0): Folder<Folder>[] {
  // Make sure nested folders come after their parents.
  // This makes sure there is one less thing to worry about later.
  const foldersSorted = folders.sort(sortByLevel);
  const foldersGroupedByParent = splitByParentPath(level)(foldersSorted);

  const tree: Folder<Folder>[] = foldersGroupedByParent.flatMap(
    ([folder, ...children]) => {
      if (children.length > 0) {
        // Repeat building process on next level.
        folder.children = buildTree(children, level + 1);
      }
      return folder as Folder<Folder>;
    }
  );

  return tree;
}

// --- HELPERS ---

const sortByLevel = by(getFolderLevel);

function getFolderLevel(folder: Folder): number {
  return folder.parentFolders.length;
}

/**
 * Create a grouping function based on current nesting level.
 * @internal
 */
export const splitByParentPath = (level: number) => {
  return splitBy((f: Folder): string => {
    const parentPath =
      f.parentFolders.length === level
        ? f.parentFolders.concat(f.title).join("/")
        : f.parentFolders.slice(0, 1 + level).join("/");

    return parentPath;
  });
};
