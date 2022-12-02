import { load, Cheerio, Element } from "cheerio";
import type { Bookmark, Folder } from "./bookmark";

export function parseBookmarks(html: string): Bookmark[] {
  const $ = load(html);

  let bookmarks: Bookmark[] = [];

  $("a").each((_, el) => {
    let $a = $(el);
    bookmarks.push({
      parentFolders: getUserFolders($a),
      title: $a.text(),
      href: $a.attr("href") || "",
      icon: $a.attr("icon") || null,
    });
  });

  return bookmarks;
}

export function parseFolders(html: string): Folder<Folder>[] {
  const $ = load(html);

  let folders: Folder<Folder>[] = [];

  $("h3").each((_, el) => {
    let $h3 = $(el);
    folders.push({
      parentFolders: getUserFolders($h3),
      title: $h3.text(),
      children: [],
    });
  });

  return folders;
}

// --- HELPERS ---

/**
 * Get list of parent folder names, in nesting order.
 * Ignore first 2 levels of nesting, since these are not user-created folders
 */
function getUserFolders($el: Cheerio<Element>): string[] {
  return getParentFolderNames($el).slice(2);
}

function getParentFolderNames($el: Cheerio<Element>): string[] {
  const $dl = $el.closest("dl").prev();
  const currentFolderName = $dl.text();
  return $dl.length > 0
    ? getParentFolderNames($dl).concat([currentFolderName])
    : [];
}
