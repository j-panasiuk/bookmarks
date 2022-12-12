import type { MapFn } from "./fn";

export function map<A, B>(
  object: Record<string, A>,
  fn: MapFn<A, B>
): Record<string, B> {
  let mapped: Record<string, B> = {};
  Object.entries(object).forEach(([key, value], i) => {
    mapped[key] = fn(value, i);
  });
  return mapped;
}

export function mapEntries<A, B>(
  object: Record<string, A>,
  fn: MapFn<[key: string, value: A], B>
): Record<string, B> {
  let mapped: Record<string, B> = {};
  Object.entries(object).forEach(([key, value], i) => {
    mapped[key] = fn([key, value], i);
  });
  return mapped;
}
