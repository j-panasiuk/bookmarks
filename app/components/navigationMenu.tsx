import { NavLink } from "@remix-run/react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  EXAMPLE_FILE_NAME,
  withoutExtension,
  type FileName,
} from "~/bookmarks.file.utils";
import { c } from "~/utils/classes";

type Props = {
  fileName: FileName;
  fileNames: FileName[];
};

export function NavigationMenu({ fileName, fileNames }: Props) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={c(
            "inline-flex h-12 w-full items-center justify-center rounded-md bg-black bg-opacity-20 px-5 text-base font-medium text-white",
            "hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          )}
        >
          {fileName}
          <ChevronDownIcon
            className={c(
              "ml-2 -mr-1 h-5 w-5 text-indigo-200",
              "hover:text-indigo-100"
            )}
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={c(
            "absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5",
            "focus:outline-none"
          )}
        >
          <div className="px-1 py-1">
            {fileNames.map((fname) => (
              <MenuItem
                key={fname}
                currentFileName={fileName}
                fileName={fname}
              />
            ))}
          </div>
          <div className="px-1 py-1">
            <MenuItem currentFileName={fileName} fileName={EXAMPLE_FILE_NAME} />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

type MenuItemProps = {
  fileName: FileName;
  currentFileName: FileName;
};

function MenuItem({ fileName, currentFileName }: MenuItemProps) {
  return (
    <Menu.Item>
      {(menuItem) => (
        <NavLink
          className={c(
            "group flex w-full items-center rounded px-2 py-2 text-sm",
            fileName === currentFileName ? "bg-indigo-100" : undefined,
            menuItem.active ? "bg-indigo-500 text-white" : "text-gray-900"
          )}
          to={`/${withoutExtension(fileName)}`}
        >
          {fileName}
        </NavLink>
      )}
    </Menu.Item>
  );
}
