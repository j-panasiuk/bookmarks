import { type ChangeEventHandler, useCallback, useRef } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
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
          "mx-auto inline-flex h-14 items-center rounded-sm border px-5 py-3",
          "text-base font-medium transition-colors",
          isPending
            ? "border-none text-indigo-300"
            : "border-dashed border-white text-white hover:border-indigo-100 hover:text-indigo-100"
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
              <DocumentPlusIcon className="mr-2 h-6 w-6" aria-hidden="true" />
              Upload bookmarks file
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
