import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { Folder, isInside, isSameAs } from "~/models/bookmark";
import { classes as c } from "~/utils/classes";

type Props = {
  folders: Folder<Folder>[];
  setCurrentFolder: (f?: Folder) => void;
  currentFolder?: Folder;
};

export function FoldersNav(props: Props) {
  return (
    <>
      <h2 onClick={() => props.setCurrentFolder(undefined)}>Folders</h2>
      <Folders level={0} {...props} />
      <pre>{JSON.stringify(props.currentFolder, null, 2)}</pre>
    </>
  );
}

interface TreeProps extends Props {
  level: number;
}

export function Folders({
  level,
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
          <p
            onClick={() => setCurrentFolder(folder)}
              className={c(
                "flex items-center rounded-md py-1 px-1.5",
                isSelected ? "bg-indigo-600 text-white" : ""
            )}
          >
              <Icon
                className={c(
                  "w-5 h-5 mr-2.5 flex-none stroke-2",
                  isSelected ? "stroke-white" : "stroke-slate-400"
            )}
              />
            {folder.title}
          </p>
          <Folders
            level={level + 1}
            folders={folder.children as Folder<Folder>[]}
            setCurrentFolder={setCurrentFolder}
            currentFolder={currentFolder}
          />
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
