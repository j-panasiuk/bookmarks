import { useCallback, useState } from "react";
import { Eq2, not } from "./fn";

type Options<T = unknown> = {
  initialSelection: T[];
  eq: Eq2<T>;
};

const defaultOptions: Options = {
  initialSelection: [],
  eq: (a) => (b) => a === b,
};

export type SelectionActions<T> = ReturnType<typeof useSelection<T>>[1];

export function useSelection<T = unknown>(options?: Partial<Options<T>>) {
  const { initialSelection, eq } = {
    ...defaultOptions,
    ...options,
  } as Options<T>;
  const [selected, setSelected] = useState<T[]>(initialSelection);

  const isSelected = useCallback(
    (element: T) => {
      const isSameElement = eq(element);
      return selected.some(isSameElement);
    },
    [eq]
  );

  const select = useCallback(
    (nextSelection: T | T[]) => {
      if (Array.isArray(nextSelection)) {
        // Add multiple to selection. Make sure to eliminate duplicates.
        setSelected((currentSelection) =>
          Array.from(
            new Set<T>([...currentSelection, ...nextSelection]).values()
          )
        );
      } else {
        // Toggle single element.
        const isSameElement = eq(nextSelection);
        setSelected((currentSelection) =>
          currentSelection.find(isSameElement)
            ? currentSelection.filter(not(isSameElement))
            : currentSelection.concat(nextSelection)
        );
      }
    },
    [eq]
  );

  const reset = useCallback(() => {
    setSelected([]);
  }, []);

  return [selected, { select, reset, isSelected }] as const;
}
