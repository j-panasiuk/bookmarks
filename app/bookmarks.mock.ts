import type { Bookmark, Folder, ItemId } from "./bookmarks.types";
import { mapEntries } from "~/utils/object";

/**
 * Mock folders.
 * @example
 * folders['/A'] // folder A
 * folders['/A_'] // different folder, also named A
 * folders['/A/A'] // a subfolder
 */
export const folders: Record<string, Folder> = mapEntries(
  {
    "/": { title: "Bookmarks bar" },
    "/A": { title: "A" },
    "/A/A": { title: "A" },
    "/A/A/A": { title: "A" },
    "/A/A_": { title: "A" },
    "/A/B": { title: "B" },
    "/A_": { title: "A" },
    "/A_/A": { title: "A" },
    "/B": { title: "B" },
    "/C": { title: "C" },
    "/C/A": { title: "A" },
  },
  ([key, { title }]) => {
    return {
      title,
      parentFolders: getParentFolders(key),
      addDate: getFragmentTimestamp(key),
      children: [],
    };
  }
);

/**
 * Mock bookmarks.
 * @example
 * bookmarks['/A'] // bookmark A
 * bookmarks['/A_'] // different bookmark, also named A
 * bookmarks['/A/A'] // bookmark in folder
 */
export const bookmarks: Record<string, Bookmark> = mapEntries(
  {
    "/A": { title: "A" },
    "/A/A": { title: "A" },
    "/A/A_": { title: "A" },
    "/A/A/A": { title: "A" },
    "/A/A/A/A": { title: "A" },
    "/A_": { title: "A" },
    "/A_/A": { title: "A" },
    "/B": { title: "B" },
    "/B/A": { title: "A" },
  },
  ([key, { title }]) => {
    return {
      title,
      addDate: -getFragmentTimestamp(key),
      parentFolders: getParentFolders(key),
      href: `#/${title}`,
      icon: null,
    };
  }
);

// --- HELPERS ---

/**
 * Mock `addDate` timestamp based on given folder location (key).
 * Use this to add unique ids to item titles
 * @internal
 * @example
 * getFragmentTimestamp("A") === 65 // folder A
 * getFragmentTimestamp("/A") === 65 // same folder A, just with a leading slash
 * getFragmentTimestamp("/A_") === 160 // different folder named A
 * getFragmentTimestamp("/A/A") === 715 // folder A with a subfolder
 */
function getFragmentTimestamp(key: string): number {
  let sum = 0;
  let fragments = getFragments(key);
  fragments.forEach((fragment, i) => {
    let fsum = 0;
    for (const c of fragment) {
      fsum += c.charCodeAt(0);
    }
    sum += fsum * 10 ** i;
  });
  return sum;
}

/**
 * Mock `parentFolders` list based on given folder location (key).
 * Use this to reconstruct unique ids of all parent folders based on key only.
 * @internal
 * @example
 * getParentFolders("/A") === [] // no parent folders
 * getParentFolders("/A/A") === ['A+65'] // A
 * getParentFolders("/A_/A") === ['A+160'] // A_
 * getParentFolders("/A/A/A") === ['A+65', 'A+715'] // A, A
 */
function getParentFolders(key: string): ItemId[] {
  let parentFolders: ItemId[] = [];
  let fragments = getFragments(key);
  for (let i = 1; i < fragments.length; i += 1) {
    let part = fragments.slice(0, i).join("/");
    parentFolders.push(
      `${fragments[i - 1].replace("_", "")}+${getFragmentTimestamp(part)}`
    );
  }
  return parentFolders;
}

function getFragments(key: string): string[] {
  return key.split("/").filter(Boolean);
}
