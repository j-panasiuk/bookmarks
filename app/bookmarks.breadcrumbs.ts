import { useCallback, useState } from "react";
import type { Folder } from "./bookmarks.types";
import { contains } from "./bookmarks.utils";
import { folders as f } from "./bookmarks.mock";

export function useBreadcrumbs(
  folders: Folder<Folder>[],
  currentFolder?: Folder<Folder>
) {
  const [breadcrumbs, setBreadcrumbs] = useState<Folder<Folder>[]>(
    getBreadcrumbs(folders, currentFolder)
  );

  const setCurrentFolder = useCallback(
    (folder?: Folder<Folder>) => {
      setBreadcrumbs(getBreadcrumbs(folders, folder));
    },
    [folders]
  );

  return [breadcrumbs, setCurrentFolder] as const;
}

function getBreadcrumbs(
  folders: Folder<Folder>[],
  currentFolder?: Folder<Folder>
): Folder<Folder>[] {
  if (currentFolder) {
    const containsCurrentFolder = contains(currentFolder);
    const parents = folders.filter(containsCurrentFolder);
    const breadcrumbs = parents.concat(currentFolder);
    return breadcrumbs;
  }

  return [];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("getBreadcrumbs", () => {
    it("returns a list of parent folders plus current folder", () => {
      const folders = Object.values(f);
      expect(getBreadcrumbs(folders)).toEqual([]);
      expect(getBreadcrumbs(folders, f["/A"])).toEqual([f["/A"]]);
      expect(getBreadcrumbs(folders, f["/A/A"])).toEqual([f["/A"], f["/A/A"]]);
      expect(getBreadcrumbs(folders, f["/A/A/A"])).toEqual([
        f["/A"],
        f["/A/A"],
        f["/A/A/A"],
      ]);
      expect(getBreadcrumbs(folders, f["/A_"])).toEqual([f["/A_"]]);
      expect(getBreadcrumbs(folders, f["/A_/A"])).toEqual([
        f["/A_"],
        f["/A_/A"],
      ]);
    });
  });
}
