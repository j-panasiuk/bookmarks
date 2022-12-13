import { FolderOpenIcon } from "@heroicons/react/24/outline";
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
              <FolderOpenIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
            </button>
          </div>
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
