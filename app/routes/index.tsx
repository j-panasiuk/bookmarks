import { ActionArgs, json } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Bookmarks } from "~/components/bookmarks";
import { BookmarkSelection } from "~/components/bookmarkSelection";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Fallback } from "~/components/fallback";
import { FoldersNav } from "~/components/folders";
import { Layout } from "~/components/layout";
import { Bookmark, Folder, isSameAs } from "~/models/bookmark";
import { parseBookmarks, parseFolderTree } from "~/models/bookmark.server";
import { getBookmarksHtml } from "~/models/bookmarkFile";
import { classes as c } from "~/utils/classes";
import { readFile } from "~/utils/file";
import { useSelection } from "~/utils/selection";

// In-memory cache
type Cache = {
  html?: string;
  bookmarks?: Bookmark[]; // TODO cache structured data too for less parsing
  folders?: Folder<Folder>[]; // TODO cache structured data too for less parsing
};

const cache: Cache = {};

export async function action({ request }: ActionArgs) {
  const payload = Object.fromEntries(await request.formData());
  if (payload.file instanceof File) {
    cache.html = await getBookmarksHtml(payload.file);
  }
  return null;
}

async function loadBookmarksFileHtml(): Promise<string> {
  // Load bookmarks html from memory cache
  if (cache.html) {
    return cache.html;
  }

  // Load bookmarks html from disk
  // Also cache it for quicker access later
  const bookmarksFilePath = process.env.BOOKMARKS_FILE_PATH;
  if (bookmarksFilePath) {
    cache.html = await readFile(bookmarksFilePath);
    return cache.html;
  }

  throw new Error("Bookmarks file not found");
}

export async function loader() {
  try {
    const html = await loadBookmarksFileHtml();
    const bookmarks = parseBookmarks(html);
    const folders = parseFolderTree(html);

    return json({ bookmarks, folders });
  } catch (err) {
    console.log("err", err);
    throw new Response(
      err instanceof Error ? err.message : "Could not read bookmarks file",
      { status: 404 }
    );
  }
}

export default function IndexRoute() {
  const { bookmarks, folders } = useLoaderData<typeof loader>();
  const [currentFolder, setCurrentFolder] = useState<Folder>();
  const [selectedBookmarks, selectionActions] = useSelection<Bookmark>({
    eq: isSameAs,
  });

  return (
    <Layout
      header={<Breadcrumbs currentFolder={currentFolder} />}
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
              <p className={c("mt-4 text-lg leading-6 text-indigo-300 italic")}>
                (...or see an example in action first)
              </p>

              <label
                className={c(
                  "mt-8 px-5 py-3 inline-flex items-center border border-transparent rounded-md",
                  "text-base font-medium text-indigo-600 bg-white shadow",
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
