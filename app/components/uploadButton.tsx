import { type ChangeEventHandler, useCallback, useRef } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { FILE_EXTENSION } from "~/bookmarks.file.utils";
import { c } from "~/utils/classes";

export function UploadButton() {
  const formRef = useRef<HTMLFormElement>(null);
  const { state } = useNavigation();
  const isPending = state !== "idle";

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      if (ev.target.files?.length) {
        formRef.current?.requestSubmit();
      }
    },
    [formRef]
  );

  return (
    <Form
      ref={formRef}
      method="post"
      action="/?index"
      encType="multipart/form-data"
      className={c("flex flex-row items-center")}
    >
      <label
        className={c(
          "mx-auto inline-flex h-12 items-center rounded px-5",
          "text-base font-medium transition-colors",
          isPending
            ? "bg-transparent text-indigo-300"
            : "bg-black bg-opacity-20 text-white hover:bg-opacity-30"
        )}
      >
        <span className="inline-flex items-center justify-between">
          {isPending ? (
            <>
              {state === "submitting"
                ? "Uploading file..."
                : "Loading bookmarks..."}
            </>
          ) : (
            <>
              <FolderPlusIcon
                className="-ml-0.5 mr-2.5 h-6 w-6"
                aria-hidden="true"
              />
              Upload bookmarks
            </>
          )}
        </span>
        <input
          type="file"
          name="file"
          className="hidden"
          accept={FILE_EXTENSION}
          onChange={handleFileSelect}
          disabled={isPending}
        />
      </label>
    </Form>
  );
}
