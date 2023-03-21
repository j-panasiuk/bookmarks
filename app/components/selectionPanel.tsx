import { useFetcher } from "@remix-run/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type Bookmark } from "~/bookmarks.types";
import { getItemPath } from "~/bookmarks.utils";
import { c } from "~/utils/classes";
import { getLinksFileContent } from "~/links.file";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedBookmarks: Bookmark[];
};

export function SelectionPanel({ open, setOpen, selectedBookmarks }: Props) {
  const saveToFile = useFetcher();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Panel title
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <ul className="relative mt-6 flex-1 px-4 sm:px-6">
                        {selectedBookmarks.map((bookmark) => (
                          <li key={getItemPath(bookmark)}>{bookmark.href}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between space-x-2 p-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            getLinksFileContent(selectedBookmarks)
                          );
                        }}
                        className={c(
                          "inline-flex items-center border px-3 py-2",
                          "rounded-md border-gray-300 bg-white text-sm font-medium leading-4 text-gray-700 shadow-sm",
                          "hover:bg-gray-50",
                          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        )}
                      >
                        Copy to Clipboard
                      </button>

                      <button
                        onClick={() =>
                          saveToFile.submit(
                            { content: getLinksFileContent(selectedBookmarks) },
                            { method: "post", action: "/saveToFile" }
                          )
                        }
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save to file
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
