import { FolderOpenIcon } from "@heroicons/react/24/outline";
import type { Folder } from "~/bookmarks.types";
import { getItemId } from "~/bookmarks.utils";
import { c } from "~/utils/classes";

type BreadcrumbsProps = {
  breadcrumbs: Folder<Folder>[];
  setCurrentFolder: (folder?: Folder<Folder>) => void;
};

export function Breadcrumbs({
  breadcrumbs,
  setCurrentFolder,
}: BreadcrumbsProps) {
  return (
    <nav
      className={c("flex h-10 justify-between rounded border border-gray-300")}
      aria-label="Breadcrumb"
    >
      <ol className="flex h-10 w-full">
        <li className="flex">
          <button
            type="button"
            className="flex h-full w-10 items-center justify-center whitespace-nowrap"
            onClick={() => setCurrentFolder()}
          >
            <FolderOpenIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-500"
              aria-hidden="true"
            />
          </button>
        </li>
        {breadcrumbs.map((b) => (
          <li key={getItemId(b)} className="flex">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <button
                type="button"
                className="h-full whitespace-nowrap pl-3 pr-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                onClick={() => setCurrentFolder(b)}
              >
                {b.title}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
