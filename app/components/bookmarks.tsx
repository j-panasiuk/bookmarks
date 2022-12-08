import { Bookmark, Folder, getItemPath, isInside } from "~/models/bookmark";
import { SelectionActions } from "~/utils/selection";
import { classes as c } from "~/utils/classes";

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
        <h2 className={c("text-sm font-semibold text-slate-500", "flex-1")}>
          /{currentFolder ? getItemPath(currentFolder) : undefined}
        </h2>
        <div>
          <button onClick={() => deselect(currentFolderBookmarks)}>
            Deselect all
          </button>
          <button onClick={() => select(currentFolderBookmarks)}>
            Select all
          </button>
        </div>
      </div>
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
