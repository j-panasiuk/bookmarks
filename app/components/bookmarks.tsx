import { Bookmark, Folder, isInside } from "~/models/bookmark";
import { SelectionActions } from "~/utils/selection";

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
      <h2>Bookmarks</h2>
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
