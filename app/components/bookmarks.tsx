import { Bookmark, Folder, isInside } from "~/models/bookmark";

type Props = {
  bookmarks: Bookmark[];
  currentFolder?: Folder;
};

export function Bookmarks({ bookmarks, currentFolder }: Props) {
  const currentFolderBookmarks = currentFolder
    ? bookmarks.filter(isInside(currentFolder))
    : bookmarks;

  return (
    <div>
      <h2>Bookmarks</h2>
      {currentFolderBookmarks.map((bookmark, index) => (
        <p key={bookmark.title + index} className="flex">
          <img src={bookmark.icon ?? undefined} className="w-6 h-6" />
          {bookmark.title} ({bookmark.parentFolders.join("/")})
        </p>
      ))}
    </div>
  );
}
