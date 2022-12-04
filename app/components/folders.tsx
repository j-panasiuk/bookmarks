import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { Folder, isInside, isSameAs } from "~/models/bookmark";

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
    <div className={level === 0 ? undefined : "ml-4"}>
      {folders.map((folder, index) => (
        <div key={folder.title + index}>
          <p
            onClick={() => setCurrentFolder(folder)}
            className={"flex".concat(
              isFolderSelected(folder, currentFolder) ? " bg-gray-100" : ""
            )}
          >
            {isFolderOpen(folder, currentFolder) ? (
              <FolderOpenIcon className="w-6 h-6 mx-2" />
            ) : (
              <FolderIcon className="w-6 h-6 mx-2" />
            )}
            {folder.title}
          </p>
          <Folders
            level={level + 1}
            folders={folder.children as Folder<Folder>[]}
            setCurrentFolder={setCurrentFolder}
            currentFolder={currentFolder}
          />
        </div>
      ))}
    </div>
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
