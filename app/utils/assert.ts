export class AssertionError extends Error {
  constructor(name: string, value: unknown, options?: ErrorOptions) {
    super(`Assertion failed: ${name || "?"} (${typeof value})`, options);
  }
}

export function assert<T extends string>(
  val: string | undefined,
  is: (val: string) => val is T
): asserts val is T {
  if (!val || !is(val)) throw new AssertionError(is.name, val);
}

export function assertExists<T>(
  val: T | undefined,
  cause?: number
): asserts val is T {
  if (val === undefined) {
    throw new AssertionError(
      assertExists.name,
      val,
      cause ? { cause } : undefined
    );
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("throws an error given undefined value", () => {
    expect(() => assertExists(undefined)).toThrow();
    expect(() => assertExists(null)).not.toThrow();
    expect(() => assertExists(false)).not.toThrow();
    expect(() => assertExists(0)).not.toThrow();
    expect(() => assertExists("")).not.toThrow();
    expect(() => assertExists({})).not.toThrow();
  });
  it("throws error with correct cause", () => {
    expect(
      (() => {
        try {
          assertExists(undefined, 404);
        } catch (err) {
          if (err instanceof Error) return err.cause;
        }
      })()
    ).toEqual(404);
  });
}
