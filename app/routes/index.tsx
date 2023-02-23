import { type ActionArgs, json } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { useBreadcrumbs } from "~/bookmarks.breadcrumbs";
import { getBookmarksHtml } from "~/bookmarks.file";
import { parseBookmarks, parseFolderTree } from "~/bookmarks.parser.server";
import type { Bookmark } from "~/bookmarks.types";
import { isSameAs } from "~/bookmarks.utils";
import { cache } from "~/cache.server";
import { Bookmarks } from "~/components/bookmarks";
import { BookmarkSelection } from "~/components/bookmarkSelection";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Fallback } from "~/components/fallback";
import { FoldersNav } from "~/components/folders";
import Header from "~/components/header";
import { Layout } from "~/components/layout";
import { assert } from "~/utils/assert";
import { classes as c } from "~/utils/classes";
import { readTextFile } from "~/utils/file";
import { useSelection } from "~/utils/selection";
import { getBookmarksFilePath } from "./index.fs";

// --- IMPORT BOOKMARKS FILE ---

export async function action({ request }: ActionArgs) {
  const payload = Object.fromEntries(await request.formData());

  if (payload.file instanceof File) {
    const fileName = payload.file.name;
    const html = await getBookmarksHtml(payload.file);

    cache.fileName = fileName;
    cache.html = html;
    delete cache.bookmarks;
    delete cache.folders;

    return new Response(null, { status: 201 });
  }

  throw new Response("Failed to upload bookmarks file", { status: 400 });
}

// --- READ BOOKMARKS FILE ---

export async function loader() {
  try {
    let { fileName, html, bookmarks, folders } = cache;

    if (!fileName) {
      fileName = await getBookmarksFilePath();
      assert(fileName, "Failed to find bookmarks file", 404);
      cache.fileName = fileName;
    }

    if (!html) {
      html = await readTextFile(fileName);
      assert(html, "Failed to read bookmarks file", 404);
      cache.html = html;
    }

    if (!bookmarks) {
      bookmarks = parseBookmarks(html);
      cache.bookmarks = bookmarks;
    }

    if (!folders) {
      folders = parseFolderTree(html);
      cache.folders = folders;
    }

    return json({ fileName, bookmarks, folders });
  } catch (err) {
    console.log("loader/err", err);

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

export default function IndexRoute() {
  const { fileName, bookmarks, folders } = useLoaderData<typeof loader>();
  const [breadcrumbs, setCurrentFolder] = useBreadcrumbs(folders);
  const [selectedBookmarks, selectionActions] = useSelection<Bookmark>({
    eq: isSameAs,
  });

  const currentFolder = breadcrumbs.at(-1);

  return (
    <Layout
      header={<Header fileName={fileName} />}
      nav={
        <FoldersNav
          folders={folders}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
        />
      }
      main={
        <Bookmarks
          bookmarks={bookmarks}
          currentFolder={currentFolder}
          {...selectionActions}
        />
      }
      aside={
        <BookmarkSelection
          selectedBookmarks={selectedBookmarks}
          {...selectionActions}
        />
      }
    />
  );
}

function WelcomeScreen() {
  const action = useActionData();
  // TODO handle file uploading state
  // TODO handle file upload failure

  const onFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files?.length) {
      document.forms.item(0)?.submit();
    }
  };

  return (
    <div className={c("min-h-screen bg-indigo-400 p-4")}>
            <Form
              method="post"
              encType="multipart/form-data"
        className={c("flex flex-col items-center space-y-4 p-4")}
            >
              <h2
                className={c(
                  "text-3xl font-bold tracking-tight text-white",
                  "sm:text-4xl"
                )}
              >
                <span className="block">Welcome to Bookmarks App</span>
              </h2>
              <label
                className={c(
            "mx-auto inline-flex items-center rounded-md border border-transparent px-5 py-3",
                  "bg-white text-base font-medium text-indigo-600 shadow",
                  "hover:bg-indigo-50"
                )}
              >
          <span className="inline-flex items-center justify-between">
            <DocumentPlusIcon
              className="mr-2 h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
            Upload bookmarks file
          </span>
                <input
                  type="file"
                  name="file"
                  accept=".html"
                  className="hidden"
            onChange={onFileChange}
                />
              </label>
            </Form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.warn(caught);

  switch (caught.status) {
    case 404:
      return <WelcomeScreen />;
    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.warn(error);
  return <Fallback title="Something went wrong" error={error.message} />;
}
