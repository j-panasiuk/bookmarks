import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Bookmark, Folder } from "~/bookmarks.types";
import { isInside, isTopLevel } from "~/bookmarks.utils";
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
  const [includeSubfolders, setIncludeSubfolders] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

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
      <div className={c("mb-1.5", "flex justify-between")}>
        <div className="mr-2.5 flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <MagnifyingGlassIcon
                className="ml-1.5 mr-1 h-5 w-5"
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

        <div className="flex items-center space-x-1.5">
          <div className="relative ml-2.5 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="subfolders"
                type="checkbox"
                className={c(
                  "h-4 w-4 rounded border-gray-300 text-indigo-600",
                  "focus:ring-indigo-500"
                )}
                checked={includeSubfolders}
                onChange={() => setIncludeSubfolders((val) => !val)}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="subfolders" className="font-medium text-gray-700">
                Include subfolders
              </label>
            </div>
          </div>
          <button
            className={c(
              "inline-flex items-center border px-3 py-2",
              "rounded-md border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => deselect(displayedBookmarks)}
          >
            Deselect all
          </button>
          <button
            className={c(
              "inline-flex items-center border px-3 py-2",
              "rounded-md border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => select(displayedBookmarks)}
          >
            Select all
          </button>
        </div>
      </div>

      {displayedBookmarks.map((bookmark, index) => (
        <p
          key={bookmark.title + index}
          onClick={() => select(bookmark)}
          className={c(
            "mb-px flex select-none items-center rounded-md py-1 px-1.5",
            isSelected(bookmark)
              ? "bg-indigo-600 text-white"
              : "hover:bg-slate-200"
          )}
        >
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
          {bookmark.title}
        </p>
      ))}
    </>
  );
}
