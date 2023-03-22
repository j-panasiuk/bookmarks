import { load, type Cheerio, type Element } from "cheerio";
import { by, splitBy } from "~/utils/array";
import type { Bookmark, Folder, ItemId } from "./bookmarks.types";
import { getFolderLevel, getItemId, joinPath } from "./bookmarks.utils";
import { folders as f, bookmarks as b } from "./bookmarks.mock";
import { type FileContent } from "./bookmarks.file.utils";

export function parseBookmarks(html: FileContent): Bookmark[] {
  const $ = load(html);

  let bookmarks: Bookmark[] = [];

  $("a").each((_, el) => {
    let $a = $(el);
    bookmarks.push({
      addDate: Number($a.attr("add_date")),
      parentFolders: getUserFolders($a),
      title: $a.text(),
      href: $a.attr("href") || "",
      icon: $a.attr("icon") || null,
    });
  });

  return bookmarks;
}

export function parseFolders(html: FileContent): Folder[] {
  const $ = load(html);

  let folders: Folder[] = [];

  $("h3").each((_, el) => {
    let $h3 = $(el);
    if (!$h3.attr("personal_toolbar_folder")) {
      folders.push({
        addDate: Number($h3.attr("add_date")),
        parentFolders: getUserFolders($h3),
        title: $h3.text(),
        children: [],
      });
    }
  });

  return folders;
}

export function parseFolderTree(html: FileContent): Folder<Folder>[] {
  return buildTree(parseFolders(html));
}

// --- FOLDER LIST ---

/**
 * Get list of parent folder names, in nesting order.
 * Ignore first 2 levels of nesting, since these are not user-created folders
 */
function getUserFolders($el: Cheerio<Element>): ItemId[] {
  return getParentFolderIds($el).slice(2);
}

function getParentFolderIds($el: Cheerio<Element>): ItemId[] {
  const $dl = $el.closest("dl").prev();
  return $dl.length > 0
    ? getParentFolderIds($dl).concat([
        getItemId({
          title: $dl.text(),
          addDate: Number($dl.attr("add_date")),
        }),
      ])
    : [];
}

// --- FOLDER TREE ---

/**
 * Given flat folder list return a tree structure.
 * @example
 * buildTree([ A, B, A/A, A/A/A ]) // [ A [ A/A [ A/A/A ] ], B ]
 */
function buildTree(folders: Folder[], level = 0): Folder<Folder>[] {
  const foldersSorted = folders.sort(sortByLevel);
  const foldersGroupedByParent = splitByParentPath(level)(foldersSorted);
  const tree = foldersGroupedByParent.flatMap(buildSubtree);

  function buildSubtree([folder, ...children]: Folder[]): Folder<Folder> {
    if (children.length > 0) {
      folder.children = buildTree(children, level + 1);
    }
    return folder as Folder<Folder>;
  }

  return tree;
}

const sortByLevel = by(getFolderLevel);

/**
 * Create a grouping function based on current nesting level.
 */
const splitByParentPath = (level: number) => {
  return splitBy((f: Folder): string => {
    const parentPath = joinPath(
      f.parentFolders.length === level
        ? f.parentFolders.concat(getItemId(f))
        : f.parentFolders.slice(0, 1 + level)
    );

    return parentPath;
  });
};

// --- TESTS ---

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("splitByParentPath", () => {
    it("leaves empty list as-is", () => {
      expect(splitByParentPath(0)([])).toEqual([]);
    });

    it("splits array into groups based on root path", () => {
      expect(splitByParentPath(0)([f["/A"], f["/B"]])).toEqual([
        [f["/A"]],
        [f["/B"]],
      ]);
      expect(splitByParentPath(0)([f["/A"], f["/A/A"], f["/B"]])).toEqual([
        [f["/A"], f["/A/A"]],
        [f["/B"]],
      ]);
      expect(
        splitByParentPath(0)([f["/A"], f["/A/A"], f["/A/A/A"], f["/B"]])
      ).toEqual([[f["/A"], f["/A/A"], f["/A/A/A"]], [f["/B"]]]);
    });

    it("splits array into groups based on parent path (level 1)", () => {
      expect(splitByParentPath(1)([f["/A/A"], f["/A/A/A"]])).toEqual([
        [f["/A/A"], f["/A/A/A"]],
      ]);
    });

    it("splits array into groups based on parent path (level 2)", () => {
      expect(splitByParentPath(2)([f["/A/A/A"]])).toEqual([[f["/A/A/A"]]]);
    });
  });

  describe("buildTree", () => {
    it("leaves empty list as-is", () => {
      expect(buildTree([])).toEqual([]);
    });

    it("turns flat list of folders into a tree structure (1 level)", () => {
      expect(buildTree([f["/A"], f["/A/A"]])).toEqual([
        {
          addDate: f["/A"].addDate,
          parentFolders: [],
          title: "A",
          children: [f["/A/A"]],
        },
      ]);
    });

    it("turns flat list of folders into a tree structure (2 levels)", () => {
      expect(buildTree([f["/A"], f["/A/A"], f["/A/A/A"]])).toEqual([
        {
          addDate: f["/A"].addDate,
          parentFolders: [],
          title: "A",
          children: [
            {
              addDate: f["/A/A"].addDate,
              parentFolders: ["A+65"],
              title: "A",
              children: [f["/A/A/A"]],
            },
          ],
        },
      ]);
    });

    it("turns flat list of folders into a tree structure (full tree)", () => {
      expect(
        buildTree([
          f["/A"],
          f["/B"],
          f["/C"],
          f["/A/A"],
          f["/A/B"],
          f["/C/A"],
          f["/A/A/A"],
        ])
      ).toEqual([
        {
          ...f["/A"],
          children: [
            {
              ...f["/A/A"],
              children: [f["/A/A/A"]],
            },
            f["/A/B"],
          ],
        },
        f["/B"],
        {
          ...f["/C"],
          children: [f["/C/A"]],
        },
      ]);
    });
  });
}
