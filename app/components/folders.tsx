import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type MouseEventHandler,
  useState,
} from "react";
import type { Folder } from "~/bookmarks.types";
import { getItemId, isSameAs } from "~/bookmarks.utils";
import { c } from "~/utils/classes";

type Props = {
  folders: Folder<Folder>[];
  setCurrentFolder: (f?: Folder) => void;
  currentFolder?: Folder;
};

export function FoldersNav(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className={c("flex")}>
        <FolderIconButton
          onClick={() => setIsExpanded((exp) => !exp)}
          isOpen={isExpanded}
        />
        <FolderLabelButton
          onClick={() => props.setCurrentFolder()}
          label={"Bookmarks bar"}
          isCurrent={props.currentFolder === undefined}
        />
      </div>

      <Folders level={0} {...props} />
    </div>
  );
}

interface FoldersProps extends Props {
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
  currentFolder,
  setCurrentFolder,
}: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = isFolderSelected(folder, currentFolder);

  return (
    <li key={getItemId(folder)}>
      <div className={c("flex")}>
        <FolderIconButton
          onClick={() => setIsOpen((open) => !open)}
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
    <button {...buttonProps}>
      <Icon
        className={c(
          "mx-2 h-5 w-5 stroke-2",
          "hover:bg-slate-700",
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
        "mb-px flex select-none items-center rounded-md py-1 px-2",
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
