import { useCallback, useState } from "react";
import { type Folder } from "./bookmarks.types";
import { getItemPath } from "./bookmarks.utils";

export type FoldersTree = ReturnType<typeof useFoldersTree>;

export function useFoldersTree() {
  const [expandedPaths, setExpanded] = useState<string[]>([]);

  const toggleFolder = useCallback((folder?: Folder<Folder>) => {
    if (folder === undefined) {
      return setExpanded([]);
    }

    const folderPath = getItemPath(folder);

    setExpanded((exp) => {
      return exp.includes(folderPath)
        ? exp.filter((path) => !path.startsWith(folderPath))
        : exp.concat(folderPath);
    });
  }, []);

  return { expandedPaths, toggleFolder } as const;
}
