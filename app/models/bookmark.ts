export type BookmarkTree = (BookmarkFolder | Bookmark)[];

export type BookmarkFolder = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian"]
   * */
  folders: string[];
  title: string;
  children: BookmarkTree;
};

export type Bookmark = {
  /**
   * Names of parent folders, following the nesting order
   * @example ["recipes", "italian", "pizza"]
   * */
  folders: string[];
  title: string;
  href: string;
  /** Base 64 icon data */
  icon: string | null;
};

// --- DOM PARSERS ---

export function getBookmarkTree(dom: Document): BookmarkTree {
  const root = dom.querySelector("dl dt dl");
  if (root instanceof HTMLDListElement) {
    return parseBookmarkTree(root);
  }
  return [];
}

function parseBookmark(a: HTMLAnchorElement): Bookmark {
  return {
    folders: [], // TODO
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
    folders: [], // TODO
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
