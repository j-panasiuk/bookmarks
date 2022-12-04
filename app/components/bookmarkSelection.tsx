import type { Bookmark } from "~/models/bookmark";
import { SelectionActions } from "~/utils/selection";

interface Props extends SelectionActions<Bookmark> {
  selectedBookmarks: Bookmark[];
}

export function BookmarkSelection({ selectedBookmarks, reset }: Props) {
  return (
    <div>
      <h2 onClick={reset}>Selected Bookmarks</h2>
      {selectedBookmarks.map((bookmark, index) => (
        <p key={bookmark.title + index} className="flex">
          {bookmark.title} ({bookmark.href})
        </p>
      ))}
    </div>
  );
}
