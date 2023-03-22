import type { ButtonHTMLAttributes, HTMLProps } from "react";
import type { Bookmark, Folder } from "~/bookmarks.types";
import { getItemId, isInside, isTopLevel } from "~/bookmarks.utils";
import { c } from "~/utils/classes";
import type { SelectionActions } from "~/utils/selection";
import { useIsLargeDevice } from "~/utils/responsive";
import { shorten } from "~/links.utils";

type BookmarksProps = {
  bookmarks: Bookmark[];
  folders: Folder[];
  currentFolder?: Folder;
  setCurrentFolder: (folder?: Folder) => void;
  searchPhrase: string;
  bookmarksSelection: SelectionActions<Bookmark>;
};

export function Bookmarks({
  bookmarks,
  folders,
  currentFolder,
  setCurrentFolder,
  searchPhrase,
  bookmarksSelection,
}: BookmarksProps) {
  const lg = useIsLargeDevice();
  const includeSubfolders = searchPhrase.length > 0;

  let displayedFolders = lg
    ? []
    : !currentFolder
    ? folders.filter(isTopLevel)
    : folders.filter(isInside(currentFolder, false));

  let displayedBookmarks = !currentFolder
    ? includeSubfolders
      ? bookmarks
      : bookmarks.filter(isTopLevel)
    : bookmarks.filter(isInside(currentFolder, includeSubfolders));

  if (searchPhrase) {
    displayedBookmarks = displayedBookmarks.filter((bookmark) =>
      bookmark.title
        .toLocaleLowerCase()
        .includes(searchPhrase.toLocaleLowerCase())
    );
  }

  return (
    <>
      <div className={c("flex h-8 items-center justify-between")}>
        <div className="px-2 text-sm">
          Display & Selection options...{/** TODO */}
        </div>
        <div className="flex items-center space-x-1.5">
          <Button
            onClick={() => bookmarksSelection.deselect(displayedBookmarks)}
          >
            - Deselect all
          </Button>
          <Button onClick={() => bookmarksSelection.select(displayedBookmarks)}>
            + Select all
          </Button>
        </div>
      </div>

      <ul>
        {displayedFolders.map((folder) => (
          <Item
            key={getItemId(folder)}
            onClick={() => setCurrentFolder(folder)}
            className={c("hover:bg-slate-200")}
          >
            {folder.title}
          </Item>
        ))}

        {displayedBookmarks.map((bookmark) => (
          <Item
            key={getItemId(bookmark)}
            onClick={() => bookmarksSelection.select(bookmark)}
            className={c(
              bookmarksSelection.isSelected(bookmark)
                ? "bg-indigo-50"
                : "hover:bg-indigo-50"
            )}
          >
            <BookmarkIcon bookmark={bookmark} />
            {bookmark.title}
            <a
              className="ml-2 text-sm text-indigo-300"
              href={bookmark.href}
              target="_blank"
            >
              {shorten(bookmark.href)}
            </a>
          </Item>
        ))}
      </ul>
    </>
  );
}

function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={c(
        "flex h-8 items-center border px-3",
        "rounded border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
        "hover:bg-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

function Item({ className, ...props }: HTMLProps<HTMLLIElement>) {
  return (
    <li
      className={c(
        "mb-px flex select-none items-center rounded-md bg-white py-1 px-2",
        className
      )}
      {...props}
    />
  );
}

type BookmarkIconProps = {
  bookmark: Bookmark;
};

function BookmarkIcon({ bookmark }: BookmarkIconProps) {
  return (
    <img
      src={bookmark.icon ?? ""}
      className={c(
        "relative mr-2.5 h-5 w-5",
        !bookmark.icon
          ? "after:absolute after:top-0 after:left-0 after:z-10 after:h-5 after:w-5 after:bg-slate-100"
          : undefined
      )}
      alt=""
    />
  );
}
