type CompareFn<T> = (a: T, b: T) => -1 | 0 | 1;

/**
 * Helper function for sorting arrays.
 * @example
 * ["aa", "", "a"].sort(by(s => s.length)) // ["", "a", "aa"]
 */
export function by<T = unknown>(evaluate: (el: T) => number): CompareFn<T> {
  return function compareFn(a, b) {
    const aval = evaluate(a);
    const bval = evaluate(b);
    if (aval < bval) return -1;
    if (bval > aval) return 1;
    return 0;
  };
}

type BucketFn<K, T = unknown> = (a: T) => K;

/**
 * Split array into buckets.
 * Preserves order of elements.
 * @example
 * splitBy(s => s.length)(["aa", "a", "b"]) // [["aa"], ["a", "a"]]
 */
export function splitBy<K, T>(bucketFn: BucketFn<K, T>) {
  return function splitFn(array: T[]) {
    const buckets = new Map<K, T[]>();
    for (const el of array) {
      const key = bucketFn(el);
      const bucket = buckets.get(key);
      buckets.set(key, bucket ? bucket.concat(el) : [el]);
    }
    return Array.from(buckets.values());
  };
}
