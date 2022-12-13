import { FolderIcon } from "@heroicons/react/24/outline";
import type { Folder } from "~/bookmarks.types";
import { getItemId } from "~/bookmarks.utils";
import { classes as c } from "~/utils/classes";

type Props = {
  breadcrumbs: Folder[];
  setCurrentFolder: (folder?: Folder) => void;
};

export function Breadcrumbs({ breadcrumbs, setCurrentFolder }: Props) {
  return (
    <nav className={c("flex")} aria-label="Breadcrumb">
      <ol className="mx-auto flex w-full max-w-screen-xl space-x-4 px-5">
        <li className="flex">
          <div className="flex items-center">
            <button
              type="button"
              className="flex items-center whitespace-nowrap"
              onClick={() => setCurrentFolder()}
            >
              <FolderIcon
                className="mr-2.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
              <span className="text-gray-500 hover:text-gray-700">
                Bookmarks
              </span>
            </button>
          </div>
        </li>
        {breadcrumbs.map((b) => (
          <li key={getItemId(b)} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <button
                type="button"
                className="ml-4 whitespace-nowrap text-sm font-medium text-gray-500 hover:text-gray-700"
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
