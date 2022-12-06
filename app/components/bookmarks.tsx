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
}: Props) {
  const currentFolderBookmarks = currentFolder
    ? bookmarks.filter(isInside(currentFolder))
    : bookmarks;

  return (
    <>
      <div className="flex justify-between">
        <h2 className={c("text-sm font-semibold text-slate-500", "flex-1")}>
          /{currentFolder ? getItemPath(currentFolder) : undefined}
        </h2>
        <button onClick={() => select(currentFolderBookmarks)}>
          Select all
        </button>
      </div>
      {currentFolderBookmarks.map((bookmark, index) => (
        <p
          key={bookmark.title + index}
          onClick={() => select(bookmark)}
          className={"flex".concat(isSelected(bookmark) ? " bg-blue-200" : "")}
        >
          <img src={bookmark.icon ?? undefined} className="w-6 h-6" />
          {bookmark.title} ({bookmark.parentFolders.join("/")})
        </p>
      ))}
    </>
  );
}
