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
    <div className={level === 0 ? "ml-0" : "ml-4"}>
      {folders.map((folder, index) => (
        <div key={folder.title + index}>
          <p onClick={() => setCurrentFolder(folder)} className="flex">
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
      <pre>{JSON.stringify(currentFolder, null, 2)}</pre>
    </div>
  );
}

function isFolderOpen(folder: Folder, currentFolder?: Folder): boolean {
  return currentFolder
    ? isSameAs(currentFolder)(folder) || isInside(currentFolder)(folder)
    : false;
}
