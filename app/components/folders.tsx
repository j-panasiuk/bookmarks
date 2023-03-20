import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";
import type { Folder } from "~/bookmarks.types";
import { getItemId, getItemPath, isSameAs } from "~/bookmarks.utils";
import { type FoldersTree, useFoldersTree } from "~/folders.tree";
import { c } from "~/utils/classes";

type FoldersNavProps = {
  folders: Folder<Folder>[];
  setCurrentFolder: (f?: Folder) => void;
  currentFolder?: Folder;
};

export function FoldersNav(props: FoldersNavProps) {
  const { expandedPaths, toggleFolder } = useFoldersTree();

  return (
    <div>
      <div className={c("flex")}>
        <FolderIconButton
          onClick={() => toggleFolder()}
          isOpen={expandedPaths.length > 0}
        />
        <FolderLabelButton
          onClick={() => props.setCurrentFolder()}
          label={"Bookmarks bar"}
          isCurrent={props.currentFolder === undefined}
        />
      </div>

      <Folders
        level={0}
        expandedPaths={expandedPaths}
        toggleFolder={toggleFolder}
        {...props}
      />
    </div>
  );
}

interface FoldersProps extends FoldersNavProps, FoldersTree {
  level: number;
}

function Folders(props: FoldersProps) {
  return (
    <ul className={c(props.level === 0 ? undefined : "ml-4")}>
      {props.folders.map((folder) => (
        <Folder key={getItemId(folder)} folder={folder} {...props} />
      ))}
    </ul>
  );
}

interface FolderProps extends FoldersProps {
  folder: Folder<Folder>;
}

function Folder({
  level,
  folder,
  expandedPaths,
  toggleFolder,
  currentFolder,
  setCurrentFolder,
}: FolderProps) {
  const folderPath = getItemPath(folder);
  const isOpen = expandedPaths.includes(folderPath);
  const isSelected = isFolderSelected(folder, currentFolder);

  return (
    <li key={folderPath}>
      <div className={c("flex")}>
        <FolderIconButton
          onClick={() => toggleFolder(folder)}
          isOpen={isOpen}
        />
        <FolderLabelButton
          onClick={() => setCurrentFolder(folder)}
          label={folder.title}
          isCurrent={isSelected}
        />
      </div>
      {isOpen ? (
        <Folders
          level={level + 1}
          folders={folder.children as Folder<Folder>[]}
          expandedPaths={expandedPaths}
          toggleFolder={toggleFolder}
          setCurrentFolder={setCurrentFolder}
          currentFolder={currentFolder}
        />
      ) : null}
    </li>
  );
}

interface FolderIconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isOpen: boolean;
}

function FolderIconButton({ isOpen, ...buttonProps }: FolderIconButtonProps) {
  const Icon = isOpen ? FolderOpenIcon : FolderIcon;

  return (
    <button className={c("rounded", "hover:bg-slate-700")} {...buttonProps}>
      <Icon
        className={c(
          "mx-2 h-5 w-5 stroke-2",
          isOpen ? "stroke-slate-100" : "stroke-slate-400"
        )}
      />
    </button>
  );
}

interface FolderLabelButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: string;
  isCurrent: boolean;
}

function FolderLabelButton({
  label,
  isCurrent,
  ...buttonProps
}: FolderLabelButtonProps) {
  return (
    <button
      {...buttonProps}
      className={c(
        "ml-px mb-px flex select-none items-center rounded-md py-1 px-2",
        "flex flex-1",
        isCurrent ? "bg-slate-600" : "hover:bg-slate-700"
      )}
    >
      {label}
    </button>
  );
}

function isFolderSelected(folder: Folder, currentFolder?: Folder): boolean {
  return currentFolder ? isSameAs(currentFolder)(folder) : false;
}
