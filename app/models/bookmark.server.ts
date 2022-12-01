import { load, Cheerio, Element } from "cheerio";
import type { Bookmark, BookmarkFolder } from "./bookmark";

export function parseBookmarks(html: string): Bookmark[] {
  const $ = load(html);

  const getParentFolderNames = ($a: Cheerio<Element>): string[] => {
    const $dl = $a.closest("dl").prev();
    const currentFolderName = $dl.text();
    return $dl.length > 0
      ? getParentFolderNames($dl).concat([currentFolderName])
      : [];
  };

  let bookmarks: Bookmark[] = [];

  $("a").each((_, el) => {
    let $a = $(el);
    bookmarks.push({
      folders: getParentFolderNames($a),
      title: $a.text(),
      href: $a.attr("href") || "",
      icon: $a.attr("icon") || null,
    });
  });

  return bookmarks;
}
