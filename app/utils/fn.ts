export type CompareFn<T, V> = (a: T, b: T) => V;
export type CompareFn2<T, V> = (a: T) => (b: T) => V;
export type Order<T> = CompareFn<T, -1 | 0 | 1>;
export type Eq<T> = CompareFn<T, boolean>;
export type Eq2<T> = CompareFn2<T, boolean>;
export type Predicate<T> = (a: T) => boolean;
export type MapFn<T, V> = (a: T, index: number) => V;

export function not<T>(fn: Predicate<T>): Predicate<T> {
  return (a: T) => !fn(a);
}
