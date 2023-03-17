export function classes(...names: (string | undefined)[]): string {
  return names.filter(isNonEmpty).map(trim).join(" ");
}

export const c = classes;

function isNonEmpty(val: string | undefined): val is string {
  return Boolean(val);
}

function trim(val: string): string {
  return val.trim();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("classes", () => {
    it("joins a list of non-empty strings", () => {
      expect(classes("")).toBe("");
      expect(classes("a", "b")).toBe("a b");
      expect(classes("a", undefined, "", "b")).toBe("a b");
    });
    it("trims returned string", () => {
      expect(classes(" a ", " b ")).toBe("a b");
    });
  });
}
