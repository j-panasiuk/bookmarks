import { describe, it, expect } from "vitest";
import { Folder, Bookmark, isSameAs, isInside } from "./bookmark";

const A: Folder = { parentFolders: [], title: "A", children: [] };
const B: Folder = { parentFolders: [], title: "B", children: [] };
const A1: Folder = { parentFolders: ["A"], title: "1", children: [] };
const A2: Folder = { parentFolders: ["A"], title: "2", children: [] };
const A1a: Folder = { parentFolders: ["A", "1"], title: "a", children: [] };

const b: Bookmark = { parentFolders: [], title: "b", href: "", icon: null };
const bA: Bookmark = {
  parentFolders: ["A"],
  title: "b",
  href: "",
  icon: null,
};
const bA1: Bookmark = {
  parentFolders: ["A", "1"],
  title: "b",
  href: "",
  icon: null,
};
const bA1a: Bookmark = {
  parentFolders: ["A", "1", "a"],
  title: "b",
  href: "",
  icon: null,
};

describe("isSameAs", () => {
  it("returns true if given the same folder (compare by location and title)", () => {
    expect(isSameAs(A)({ ...A })).toBe(true);
    expect(isSameAs(A)({ ...A, children: [777] })).toBe(true);
    expect(isSameAs(A)(B)).toBe(false);
    expect(isSameAs(A)(A1)).toBe(false);
    expect(isSameAs(A1)(A2)).toBe(false);
    expect(isSameAs(A1)(A1a)).toBe(false);
  });
});

describe("isInside", () => {
  it("returns true if second folder is inside first folder", () => {
    expect(isInside(A)(A)).toBe(false);
    expect(isInside(A)(B)).toBe(false);
    expect(isInside(A)(A1)).toBe(true);
    expect(isInside(A1)(A2)).toBe(false);
    expect(isInside(A1)(A1a)).toBe(true);
  });
  it("returns true if second bookmark is inside first folder", () => {
    expect(isInside(A)(b)).toBe(false);
    expect(isInside(A)(bA)).toBe(true);
    expect(isInside(A)(bA1)).toBe(true);
    expect(isInside(A)(bA1a)).toBe(true);
    expect(isInside(A1)(b)).toBe(false);
    expect(isInside(A1)(bA)).toBe(false);
    expect(isInside(A1)(bA1)).toBe(true);
    expect(isInside(A1)(bA1a)).toBe(true);
    expect(isInside(A1a)(b)).toBe(false);
    expect(isInside(A1a)(bA)).toBe(false);
    expect(isInside(A1a)(bA1)).toBe(false);
    expect(isInside(A1a)(bA1a)).toBe(true);
    expect(isInside(B)(b)).toBe(false);
  });
});
