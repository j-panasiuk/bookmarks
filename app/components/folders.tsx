import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import type { Folder } from "~/models/bookmark";

type Props = {
  folders: Folder<Folder>[];
};

export function Folders({ folders }: Props) {
  return (
    <div>
      {folders.map((folder, index) => (
        <p key={folder.title + index} className="flex">
          <FolderIcon className="w-6 h-6" />
          {folder.title} ({folder.parentFolders.join("/")})
        </p>
      ))}
    </div>
  );
}
