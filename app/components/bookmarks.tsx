import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Bookmark, Folder } from "~/bookmarks.types";
import { getItemPath, isInside } from "~/bookmarks.utils";
import { classes as c } from "~/utils/classes";
import type { SelectionActions } from "~/utils/selection";

interface Props extends SelectionActions<Bookmark> {
  bookmarks: Bookmark[];
  currentFolder?: Folder;
}

export function Bookmarks({
  bookmarks,
  currentFolder,
  isSelected,
  select,
  deselect,
}: Props) {
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [searchPhrase, setSearchPhrase] = useState("");

  let displayedBookmarks = currentFolder
    ? bookmarks.filter(isInside(currentFolder, includeSubfolders))
    : bookmarks;

  if (searchPhrase) {
    displayedBookmarks = displayedBookmarks.filter((bookmark) =>
      bookmark.title
        .toLocaleLowerCase()
        .includes(searchPhrase.toLocaleLowerCase())
    );
  }

  return (
    <>
      <div className={c("mb-1.5", "flex justify-between")}>
        <h2
          className={c(
            "todo",
            "text-sm font-semibold text-slate-500",
            "flex-1"
          )}
        >
          /{currentFolder ? getItemPath(currentFolder) : undefined}
        </h2>
        <div className="flex space-x-1.5 items-center">
          <label className="inline-flex items-center space-x-1.5 h-5">
            <input
              type="checkbox"
              checked={includeSubfolders}
              onChange={() => setIncludeSubfolders((val) => !val)}
            />
            <span>Include subfolders</span>
          </label>
          <button
            className={c(
              "px-3 py-2 inline-flex items-center border",
              "border-gray-300 bg-white rounded-md text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => deselect(displayedBookmarks)}
          >
            Deselect all
          </button>
          <button
            className={c(
              "px-3 py-2 inline-flex items-center border",
              "border-gray-300 bg-white rounded-md text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => select(displayedBookmarks)}
          >
            Select all
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
            <MagnifyingGlassIcon
              className="h-5 w-5 ml-1.5 mr-1"
              aria-hidden="true"
            />
          </div>
          <input
            id="search-field"
            className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Search"
            type="search"
            name="search"
            value={searchPhrase}
            onChange={(ev) => setSearchPhrase(ev.target.value)}
          />
        </div>
      </div>

      {displayedBookmarks.map((bookmark, index) => (
        <p
          key={bookmark.title + index}
          onClick={() => select(bookmark)}
          className={c(
            "flex items-center rounded-md py-1 px-1.5 mb-px select-none",
            isSelected(bookmark)
              ? "bg-indigo-600 text-white"
              : "hover:bg-slate-200"
          )}
        >
          <img
            src={bookmark.icon ?? undefined}
            className={c("w-5 h-5 mr-2.5")}
            alt="Bookmark icon"
          />
          {bookmark.title} ({bookmark.parentFolders.join("/")})
        </p>
      ))}
    </>
  );
}
