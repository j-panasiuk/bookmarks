import { HomeIcon } from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Folder } from "~/bookmarks.types";
import { isInside, isSameAs } from "~/bookmarks.utils";
import { classes as c } from "~/utils/classes";

type Props = {
  folders: Folder<Folder>[];
  setCurrentFolder: (f?: Folder) => void;
  currentFolder?: Folder;
};

export function FoldersNav(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className={c("flex")}>
        <button
          className={c(
            "mr-1 mb-px cursor-default select-none items-center rounded-md py-1 px-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-50",
            "flex flex-1"
          )}
          onClick={() => props.setCurrentFolder()}
        >
          <FolderOpenIcon className={c("mr-2.5 h-5 w-5")} />
          <h2 className="my-0.5 h-5">FOLDERS</h2>
        </button>
        <button onClick={() => setIsExpanded(true)}>
          <ChevronDownIcon
            aria-hidden
            className={c("h-5 w-5 stroke-slate-400 hover:stroke-slate-600")}
          />
        </button>
        <button onClick={() => setIsExpanded(false)}>
          <ChevronUpIcon
            aria-hidden
            className={c("h-5 w-5 stroke-slate-400 hover:stroke-slate-600")}
          />
        </button>
      </div>

      <Folders level={0} isExpanded={isExpanded} {...props} />
    </>
  );
}

interface TreeProps extends Props {
  level: number;
  isExpanded: boolean;
}

export function Folders({
  level,
  isExpanded,
  folders,
  setCurrentFolder,
  currentFolder,
}: TreeProps) {
  return (
    <ul className={c(level === 0 ? undefined : "ml-4")}>
      {folders.map((folder, index) => {
        const isOpen = isFolderOpen(folder, currentFolder);
        const isSelected = isFolderSelected(folder, currentFolder);
        const Icon = isOpen ? FolderOpenIcon : FolderIcon;

        return (
          <li key={folder.title + index}>
            <div
              onClick={() => setCurrentFolder(folder)}
              className={c(
                "mb-px flex select-none items-center rounded-md py-1 px-1.5",
                isSelected ? "bg-slate-100 text-slate-600" : "hover:bg-slate-50"
              )}
            >
              <Icon
                className={c(
                  "mr-2.5 h-5 w-5 flex-none stroke-2",
                  isSelected ? "stroke-slate-600" : "stroke-slate-400"
                )}
              />
              {folder.title}
            </div>
            {isExpanded || isOpen ? (
              <Folders
                level={level + 1}
                isExpanded={isExpanded}
                folders={folder.children as Folder<Folder>[]}
                setCurrentFolder={setCurrentFolder}
                currentFolder={currentFolder}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function isFolderSelected(folder: Folder, currentFolder?: Folder): boolean {
  return currentFolder ? isSameAs(currentFolder)(folder) : false;
}

function isFolderOpen(folder: Folder, currentFolder?: Folder): boolean {
  return currentFolder
    ? isSameAs(currentFolder)(folder) || isInside(folder)(currentFolder)
    : false;
}
