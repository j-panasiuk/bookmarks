import { describe, it, expect } from "vitest";
import type { Folder } from "./bookmark";
import { buildTree, splitByParentPath } from "./folderTree";

const A: Folder = { parentFolders: [], title: "A", children: [] };
const B: Folder = { parentFolders: [], title: "B", children: [] };
const C: Folder = { parentFolders: [], title: "C", children: [] };
const A1: Folder = { parentFolders: ["A"], title: "1", children: [] };
const A2: Folder = { parentFolders: ["A"], title: "2", children: [] };
const C1: Folder = { parentFolders: ["C"], title: "1", children: [] };
const A1a: Folder = { parentFolders: ["A", "1"], title: "a", children: [] };

describe("splitByParentPath", () => {
  it("leaves empty list as-is", () => {
    expect(splitByParentPath(0)([])).toEqual([]);
  });

  it("splits array into groups based on root path", () => {
    expect(splitByParentPath(0)([A, B])).toEqual([[A], [B]]);
    expect(splitByParentPath(0)([A, A1, B])).toEqual([[A, A1], [B]]);
    expect(splitByParentPath(0)([A, A1, A1a, B])).toEqual([[A, A1, A1a], [B]]);
  });

  it("splits array into groups based on parent path (level 1)", () => {
    expect(splitByParentPath(1)([A1, A1a])).toEqual([[A1, A1a]]);
  });

  it("splits array into groups based on parent path (level 2)", () => {
    expect(splitByParentPath(2)([A1a])).toEqual([[A1a]]);
  });
});

describe("buildTree", () => {
  it("leaves empty list as-is", () => {
    expect(buildTree([])).toEqual([]);
  });

  it("turns flat list of folders into a tree structure (1 level)", () => {
    expect(buildTree([A, A1])).toEqual([
      {
        parentFolders: [],
        title: "A",
        children: [A1],
      },
    ]);
  });

  it("turns flat list of folders into a tree structure (2 levels)", () => {
    expect(buildTree([A, A1, A1a])).toEqual([
      {
        parentFolders: [],
        title: "A",
        children: [
          {
            parentFolders: ["A"],
            title: "1",
            children: [A1a],
          },
        ],
      },
    ]);
  });

  it("turns flat list of folders into a tree structure (full tree)", () => {
    expect(buildTree([A, B, C, A1, A2, C1, A1a])).toEqual([
      {
        parentFolders: [],
        title: "A",
        children: [
          {
            parentFolders: ["A"],
            title: "1",
            children: [A1a],
          },
          A2,
        ],
      },
      B,
      {
        parentFolders: [],
        title: "C",
        children: [C1],
      },
    ]);
  });
});
