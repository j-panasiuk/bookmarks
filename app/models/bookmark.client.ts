import { useMemo } from "react";
import { Bookmark, BookmarkFolder, BookmarkTree } from "./bookmark";

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

export function getBookmarkTree(dom: Document): BookmarkTree {
  const root = dom.querySelector("dl dt dl");
  if (root instanceof HTMLDListElement) {
    return parseBookmarkTree(root);
  }
  return [];
}

function parseBookmark(a: HTMLAnchorElement): Bookmark {
  return {
    parentFolders: [], // TODO
    title: a.innerText,
    href: a.href,
    icon: a.getAttribute("icon"),
  };
}

function parseBookmarkFolder(
  h: HTMLHeadingElement,
  dl: HTMLDListElement
): BookmarkFolder {
  return {
    parentFolders: [], // TODO
    title: h.innerText,
    children: parseBookmarkTree(dl),
  };
}

function parseBookmarkTree(dl: HTMLDListElement): BookmarkTree {
  return Array.from(dl.children).reduce((_children, el) => {
    if (isHTMLDTElement(el)) {
      const bookmarkOrFolder = parse(el);
      if (bookmarkOrFolder) {
        return _children.concat(bookmarkOrFolder);
      }
    }
    return _children;
  }, [] as BookmarkTree);
}

function parse(dt: HTMLDTElement): BookmarkFolder | Bookmark | null {
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
