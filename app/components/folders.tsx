import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { Folder, isInside, isSameAs } from "~/models/bookmark";

type Props = {
  folders: Folder<Folder>[];
  setCurrentFolder: (f?: Folder) => void;
  currentFolder?: Folder;
};

export function Folders({ folders, setCurrentFolder, currentFolder }: Props) {
  return (
    <div>
      <h2 onClick={() => setCurrentFolder(undefined)}>Folders</h2>
      {folders.map((folder, index) => (
        <p
          key={folder.title + index}
          onClick={() => setCurrentFolder(folder)}
          className="flex"
        >
          {isFolderOpen(folder, currentFolder) ? (
            <FolderOpenIcon className="w-6 h-6" />
          ) : (
            <FolderIcon className="w-6 h-6" />
          )}
          {folder.title} ({folder.parentFolders.join("/")})
        </p>
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
