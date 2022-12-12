import type { Order, MapFn } from "~/utils/fn";

/**
 * Helper function for sorting arrays.
 * @example
 * ["aa", "", "a"].sort(by(s => s.length)) // ["", "a", "aa"]
 */
export function by<T = unknown>(evaluate: (el: T) => number): Order<T> {
  return function compareFn(a, b) {
    const aval = evaluate(a);
    const bval = evaluate(b);
    if (aval < bval) return -1;
    if (bval > aval) return 1;
    return 0;
  };
}

/**
 * Split array into buckets.
 * Preserves order of elements.
 * @example
 * splitBy(s => s.length)(["aa", "a", "b"]) // [["aa"], ["a", "a"]]
 */
export function splitBy<K, T>(bucketFn: MapFn<T, K>) {
  return function splitFn(array: T[]) {
    const buckets = new Map<K, T[]>();
    for (const el of array) {
      const key = bucketFn(el, 0);
      const bucket = buckets.get(key);
      buckets.set(key, bucket ? bucket.concat(el) : [el]);
    }
    return Array.from(buckets.values());
  };
}
