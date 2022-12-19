import { useFetcher } from "@remix-run/react";
import type { Bookmark } from "~/bookmarks.types";
import type { SelectionActions } from "~/utils/selection";

interface Props extends SelectionActions<Bookmark> {
  selectedBookmarks: Bookmark[];
}

export function BookmarkSelection({ selectedBookmarks, reset }: Props) {
  const saveToFile = useFetcher();

  return (
    <>
      <div className="flex justify-between">
        <h2>
          <span className="mr-1.5 inline-flex h-[34px] items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
            {selectedBookmarks.length}
          </span>
          Selected
        </h2>
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
