import { useMemo } from "react";
import type { Bookmark, BookmarkItem, Folder } from "~/bookmarks.types";

/**
 * @deprecated
 * Use server parser instead
 */
export function useBookmarkTree(html: string) {
  const tree = useMemo(() => {
    if (typeof document !== "undefined" && typeof DOMParser === "function") {
      const dom = new DOMParser().parseFromString(html, "text/html");
      return getBookmarkTree(dom);
    }
  }, [html]);

  return tree;
}

// --- CLIENT SIDE PARSER ---

/**
 * @deprecated
 * Use server parser instead
 */
export function getBookmarkTree(dom: Document): BookmarkItem[] {
  const root = dom.querySelector("dl dt dl");
  if (root instanceof HTMLDListElement) {
    return parseBookmarkTree(root);
  }
  return [];
}

function parseBookmark(a: HTMLAnchorElement): Bookmark {
  return {
    addDate: Number(a.getAttribute("add_date")),
    parentFolders: [], // TODO
    title: a.innerText,
    href: a.href,
    icon: a.getAttribute("icon"),
  };
}

function parseBookmarkFolder(
  h: HTMLHeadingElement,
  dl: HTMLDListElement
): Folder<BookmarkItem> {
  return {
    addDate: Number(h.getAttribute("add_date")),
    parentFolders: [], // TODO
    title: h.innerText,
    children: parseBookmarkTree(dl),
  };
}

function parseBookmarkTree(dl: HTMLDListElement): BookmarkItem[] {
  return Array.from(dl.children).reduce((_children, el) => {
    if (isHTMLDTElement(el)) {
      const bookmarkOrFolder = parse(el);
      if (bookmarkOrFolder) {
        return _children.concat(bookmarkOrFolder);
      }
    }
    return _children;
  }, [] as BookmarkItem[]);
}

function parse(dt: HTMLDTElement): BookmarkItem | null {
  const fst = dt.children.item(0);
  if (fst instanceof HTMLAnchorElement) {
    return parseBookmark(fst);
  }

  const snd = dt.children.item(1);
  if (fst instanceof HTMLHeadingElement && snd instanceof HTMLDListElement) {
    return parseBookmarkFolder(fst, snd);
  }

  return null;
}

// --- DOM HELPERS ---

interface HTMLDTElement extends HTMLElement {
  tagName: "DT";
}

function isHTMLDTElement(el: Element): el is HTMLDTElement {
  return el instanceof HTMLElement && el.tagName === "DT";
}
