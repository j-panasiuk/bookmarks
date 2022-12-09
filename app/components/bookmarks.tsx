import { SelectionActions } from "~/utils/selection";
import { classes as c } from "~/utils/classes";
import type { Bookmark, Folder } from "~/bookmarks.types";
import { getItemPath, isInside } from "~/bookmarks.utils";

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
  const currentFolderBookmarks = currentFolder
    ? bookmarks.filter(isInside(currentFolder))
    : bookmarks;

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
            <input type="checkbox" defaultChecked />
            <span>Include subfolders</span>
          </label>
          <button
            className={c(
              "px-3 py-2 inline-flex items-center border",
              "border-gray-300 bg-white rounded-md text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => deselect(currentFolderBookmarks)}
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
            onClick={() => select(currentFolderBookmarks)}
          >
            Select all
          </button>
        </div>
      </div>

      <div className="todo">Search</div>

      {currentFolderBookmarks.map((bookmark, index) => (
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
          />
          {bookmark.title} ({bookmark.parentFolders.join("/")})
        </p>
      ))}
    </>
  );
}
