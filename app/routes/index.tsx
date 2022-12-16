import { type ActionArgs, json } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { useBreadcrumbs } from "~/bookmarks.breadcrumbs";
import { getBookmarksHtml } from "~/bookmarks.file";
import { parseBookmarks, parseFolderTree } from "~/bookmarks.parser.server";
import type { Bookmark, Folder } from "~/bookmarks.types";
import { isSameAs } from "~/bookmarks.utils";
import { Bookmarks } from "~/components/bookmarks";
import { BookmarkSelection } from "~/components/bookmarkSelection";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Fallback } from "~/components/fallback";
import { FoldersNav } from "~/components/folders";
import Header from "~/components/header";
import { Layout } from "~/components/layout";
import { classes as c } from "~/utils/classes";
import { readTextFile } from "~/utils/file";
import { useSelection } from "~/utils/selection";
import { getBookmarksFilePath } from "./index.fs";

// In-memory cache
type Cache = {
  fileName: string;
  html: string;
  bookmarks: Bookmark[];
  folders: Folder<Folder>[];
};

const cache: Partial<Cache> = {};

// --- IMPORT BOOKMARKS FILE ---

export async function action({ request }: ActionArgs) {
  const payload = Object.fromEntries(await request.formData());
  if (payload.file instanceof File) {
    cache.fileName = payload.file.name;
    cache.html = await getBookmarksHtml(payload.file);
    delete cache.bookmarks;
    delete cache.folders;
  }
  return new Response(null, { status: 201 });
}

// --- READ BOOKMARKS FILE ---

export async function loader() {
  try {
    const { fileName, html } = await loadBookmarksFile();
    const { bookmarks, folders } = parseBookmarksAndFolders(html);

    return json({ fileName, bookmarks, folders });
  } catch (err) {
    console.log("err", err);
    throw new Response(
      err instanceof Error ? err.message : "Could not read bookmarks file",
      { status: 404 }
    );
  }
}

async function loadBookmarksFile(): Promise<{
  fileName: string;
  html: string;
}> {
  // Load bookmarks html from memory cache
  if (cache.fileName && cache.html) {
    return {
      fileName: cache.fileName,
      html: cache.html,
    };
  }

  // Load bookmarks html from disk
  // Also cache it for quicker access later
  const bookmarksFilePath = await getBookmarksFilePath();
  if (bookmarksFilePath) {
    cache.fileName = bookmarksFilePath;
    cache.html = await readTextFile(bookmarksFilePath);
    return {
      fileName: cache.fileName,
      html: cache.html,
    };
  }

  throw new Error("Bookmarks file not found");
}

function parseBookmarksAndFolders(html: string): {
  bookmarks: Bookmark[];
  folders: Folder<Folder>[];
} {
  // Load parsed bookmarks and folders from memory cache
  if (cache.bookmarks && cache.folders) {
    return {
      bookmarks: cache.bookmarks,
      folders: cache.folders,
    };
  }

  // Parse bookmarks and folders from loaded html
  // Also cache it for quicker access later
  const bookmarks = parseBookmarks(html);
  const folders = parseFolderTree(html);
  cache.bookmarks = bookmarks;
  cache.folders = folders;
  return {
    bookmarks: cache.bookmarks,
    folders: cache.folders,
  };
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

  return (
    <div className={c("min-h-screen bg-indigo-100")}>
      <div className={c("mx-auto max-w-7xl py-16 px-4", "sm:px-6", "lg:px-8")}>
        <div
          className={c(
            "overflow-hidden rounded-lg bg-indigo-700 shadow-xl",
            "lg:grid lg:grid-cols-2 lg:gap-4"
          )}
        >
          <div
            className={c(
              "px-6 pt-10 pb-12",
              "sm:px-16 sm:pt-16",
              "lg:py-16 lg:pr-0",
              "xl:py-20 xl:px-20"
            )}
          >
            <Form
              method="post"
              encType="multipart/form-data"
              className="lg:self-center"
            >
              <h2
                className={c(
                  "text-3xl font-bold tracking-tight text-white",
                  "sm:text-4xl"
                )}
              >
                <span className="block">Welcome to Bookmarks App</span>
              </h2>
              <p className={c("mt-4 text-lg leading-6 text-indigo-200")}>
                This application wilh help you browse through and manage your
                browser bookmarks.
              </p>
              <p className={c("mt-4 text-lg leading-6 text-indigo-200")}>
                <strong>Export</strong> bookmarks from your browser.
                <br />
                This export should be an <b>.html</b> file.
              </p>
              <p className={c("mt-4 text-lg leading-6 text-indigo-200")}>
                <strong>Upload</strong> the file here.
              </p>
              <p className={c("mt-4 text-lg italic leading-6 text-indigo-300")}>
                (...or see an example in action first)
              </p>

              <label
                className={c(
                  "mt-8 inline-flex items-center rounded-md border border-transparent px-5 py-3",
                  "bg-white text-base font-medium text-indigo-600 shadow",
                  "hover:bg-indigo-50"
                )}
              >
                <span>Load Bookmarks</span>
                <input
                  type="file"
                  name="file"
                  accept=".html"
                  className="hidden"
                  onChange={(ev) => {
                    if (ev.target.files?.length) {
                      document.forms.item(0)?.submit();
                    }
                  }}
                />
              </label>
            </Form>
          </div>
          <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
            <img
              className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="https://tailwindui.com/img/component-images/full-width-with-sidebar.jpg"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
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
