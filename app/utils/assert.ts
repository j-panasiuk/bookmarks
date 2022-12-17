export function assert<T>(
  val: T | undefined,
  message?: string,
  cause?: number
): asserts val is T {
  if (val === undefined) {
    throw new Error(message, cause ? { cause } : undefined);
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("throws an error given undefined value", () => {
    expect(() => assert(undefined)).toThrow();
    expect(() => assert(null)).not.toThrow();
    expect(() => assert(false)).not.toThrow();
    expect(() => assert(0)).not.toThrow();
    expect(() => assert("")).not.toThrow();
    expect(() => assert({})).not.toThrow();
  });
  it("throws error with correct message and cause", () => {
    expect(() => assert(undefined, "Bad dog!")).toThrow("Bad dog!");
    expect(
      (() => {
        try {
          assert(undefined, "Missing", 404);
        } catch (err) {
          if (err instanceof Error) return err.cause;
        }
      })()
    ).toEqual(404);
  });
}
