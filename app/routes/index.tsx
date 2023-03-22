import { type ActionArgs, redirect, LoaderArgs, json } from "@remix-run/node";
import { Link, useActionData, useCatch } from "@remix-run/react";
import { getMostRecentFileName, saveFile } from "~/bookmarks.file";
import {
  assertFile,
  assertFileName,
  EXAMPLE_FILE_NAME,
  withoutExtension,
} from "~/bookmarks.file.utils";
import { Fallback } from "~/components/fallback";
import { c } from "~/utils/classes";
import { log, logError, logSuccess, logWarning } from "~/utils/console";
import { UploadButton } from "~/components/uploadButton";
import { useToast } from "~/components/toasts";
import { useEffect } from "react";

// --- IMPORT BOOKMARKS FILE ---

export async function action({ request }: ActionArgs) {
  log("action /");
  try {
    const payload = Object.fromEntries(await request.formData());

    assertFile(payload.file);
    assertFileName(payload.file.name);

    await saveFile(payload.file);

    logSuccess("action / saved", payload.file.name);
    return redirect(`/${withoutExtension(payload.file.name)}`);
  } catch (err) {
    logError("action /", (err as any)?.message);
    return new Response("Failed to upload bookmarks file", { status: 400 });
  }
}

// --- READ BOOKMARKS FILE ---

export async function loader({ request }: LoaderArgs) {
  log("loader", request.url);
  try {
    const fileName = await getMostRecentFileName();

    if (fileName) {
      return redirect(`/${withoutExtension(fileName)}`);
    }

    return new Response("", { status: 200 });
  } catch (err) {
    logError("loader /", (err as any)?.message);

    throw new Response(
      err instanceof Error ? err.message : "Failed to load bookmarks",
      {
        status:
          err instanceof Error && typeof err.cause === "number"
            ? err.cause
            : 500,
      }
    );
  }
}

export default function WelcomeScreen() {
  const actionData = useActionData<typeof action>();
  const toast = useToast();

  useEffect(() => {
    if (typeof actionData === "string") {
      toast({ message: actionData });
    }
  }, [toast, actionData]);

  return (
    <div
      className={c(
        "flex min-h-screen flex-col items-center space-y-4 bg-indigo-400 p-4 text-white"
      )}
    >
      <h2
        className={c(
          "text-3xl font-bold tracking-tight text-white",
          "sm:text-4xl"
        )}
      >
        <span className="block">Welcome to Bookmarks App</span>
      </h2>
      <UploadButton />
      <div> -- or -- </div>
      <Link to={`/${withoutExtension(EXAMPLE_FILE_NAME)}`}>
        See example file
      </Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  logWarning(caught);
  return <Fallback title="Upload error" error={caught.data} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  logWarning(error);
  return <Fallback title="Unexpected error" error={error.message} />;
}
