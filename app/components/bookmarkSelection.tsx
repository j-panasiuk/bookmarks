import { useFetcher } from "@remix-run/react";
import type { Bookmark } from "~/bookmarks.types";
import type { SelectionActions } from "~/utils/selection";
import { c } from "~/utils/classes";

interface Props extends SelectionActions<Bookmark> {
  selectedBookmarks: Bookmark[];
}

export function BookmarkSelection({ selectedBookmarks, reset }: Props) {
  const saveToFile = useFetcher();

  return (
    <>
      <div className="mb-1.5 flex justify-between">
        <h2>
          <span className="mr-1.5 inline-flex h-[34px] items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
            {selectedBookmarks.length}
          </span>
          Selected
        </h2>
        {selectedBookmarks.length > 0 ? (
          <button
            className={c(
              "inline-flex items-center border px-3 py-2",
              "rounded-md border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={reset}
          >
            Clear
          </button>
        ) : null}
      </div>

      <section className="mb-2.5">
        {selectedBookmarks.map((bookmark, index) => (
          <p
            key={bookmark.title + index}
            className="flex select-none items-center rounded-md border-b py-1 px-1.5"
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
      </section>

      {selectedBookmarks.length > 0 ? (
        <footer className="sticky bottom-0 space-x-2">
          <button
            onClick={() =>
              saveToFile.submit(
                { content: selectedBookmarks.map((b) => b.href).join("\n") },
                { method: "post", action: "/saveToFile" }
              )
            }
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save to file
          </button>

          <button
            className={c(
              "inline-flex items-center border px-3 py-2",
              "rounded-md border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
              "hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => {
              navigator.clipboard.writeText(
                selectedBookmarks.map((b) => b.href).join("\n")
              );
            }}
          >
            Copy to Clipboard
          </button>
        </footer>
      ) : null}
    </>
  );
}
