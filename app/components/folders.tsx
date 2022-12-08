import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Folder, isInside, isSameAs } from "~/models/bookmark";
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
      <div className={c("mb-1.5", "flex")}>
        <h2 className={c("text-sm font-semibold text-slate-500", "flex-1")}>
          FOLDERS
        </h2>
        <button onClick={() => setIsExpanded(true)}>
          <ChevronDownIcon
            aria-hidden
            className={c("w-5 h-5 stroke-slate-400 hover:stroke-slate-600")}
          />
        </button>
        <button onClick={() => setIsExpanded(false)}>
          <ChevronUpIcon
            aria-hidden
            className={c("w-5 h-5 stroke-slate-400 hover:stroke-slate-600")}
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
                "flex items-center rounded-md py-1 px-1.5 mb-px select-none",
                isSelected ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
              )}
            >
              <Icon
                className={c(
                  "w-5 h-5 mr-2.5 flex-none stroke-2",
                  isSelected ? "stroke-white" : "stroke-slate-400"
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
