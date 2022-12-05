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
      <div className="flex justify-between">
        <h2>Selected</h2>
        <button onClick={reset}>Clear</button>
      </div>

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
