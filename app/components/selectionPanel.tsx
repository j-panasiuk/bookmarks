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
  const linksFileContent = getLinksFileContent(selectedBookmarks);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-400 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <section className="flex min-h-0 flex-1 flex-col overflow-y-scroll">
                      <header className="flex h-app/header items-center justify-between px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Selected bookmarks
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </header>
                      <div className="relative max-w-full flex-1 overflow-auto py-2 px-4 text-sm sm:px-6">
                        <textarea
                          className={c(
                            "h-full w-full rounded border-indigo-400 bg-slate-50",
                            "sm:text-sm",
                            "hover:border-indigo-300",
                            "focus:border-indigo-300  focus:outline-none focus:ring-0"
                          )}
                          defaultValue={linksFileContent}
                        />
                      </div>
                    </section>
                    <footer className="flex justify-between space-x-2 px-4 pb-6 pt-4 sm:px-6">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(linksFileContent);
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
                            { content: linksFileContent },
                            { method: "post", action: "/saveToFile" }
                          )
                        }
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save to file
                      </button>
                    </footer>
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

type ButtonProps = {
  selectedCount: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function SelectionPanelButton({ selectedCount, setOpen }: ButtonProps) {
  return (
    <button
      onClick={() => setOpen(true)}
      className={c(
        "inline-flex h-12 w-full items-center justify-center rounded-md bg-black bg-opacity-20 px-5 text-base font-medium text-white",
        "hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      )}
    >
      Selected
      <span className="ml-2.5 -mr-1 min-w-[2rem] rounded-lg bg-white px-2 py-0.5 font-bold text-indigo-600">
        {selectedCount}
      </span>
    </button>
  );
}
