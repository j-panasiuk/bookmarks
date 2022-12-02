import { describe, it, expect } from "vitest";
import { by, splitBy } from "./array";

describe("by", () => {
  it("given an evaluate function returns a function which sorts arrays", () => {
    expect(["aa", "", "a"].sort(by((s) => s.length))).toEqual(["", "a", "aa"]);
  });
});

describe("splitBy", () => {
  it("given a bucket function returns a function which splits arrays into buckets", () => {
    expect(splitBy((s: string) => s.length)(["aa", "a", "b"])).toEqual([
      ["aa"],
      ["a", "b"],
    ]);
    expect(
      splitBy((s: string) => s.length)(["aa", "", "a", "b", "bb", "a"])
    ).toEqual([["aa", "bb"], [""], ["a", "b", "a"]]);
  });
});
