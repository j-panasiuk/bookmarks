import { useFetcher } from "@remix-run/react";
import type { Bookmark } from "~/models/bookmark";
import { SelectionActions } from "~/utils/selection";

interface Props extends SelectionActions<Bookmark> {
  selectedBookmarks: Bookmark[];
}

export function BookmarkSelection({ selectedBookmarks, reset }: Props) {
  const saveToFile = useFetcher();

  return (
    <>
      <h2 onClick={reset}>Selected Bookmarks</h2>
      {selectedBookmarks.map((bookmark, index) => (
        <p key={bookmark.title + index} className="flex">
          {bookmark.title} ({bookmark.href})
        </p>
      ))}
      <button
        onClick={() =>
          saveToFile.submit(
            { content: selectedBookmarks.map((b) => b.href).join("\n") },
            { method: "post", action: "/saveToFile" }
          )
        }
      >
        Save to file
      </button>
    </>
  );
}
