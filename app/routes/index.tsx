import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { Fallback } from "~/components/fallback";
import { parseBookmarks, parseFolders } from "~/models/bookmark.server";
import { getFilePath, readFile } from "~/utils/file";

export async function loader() {
  try {
    const path = getFilePath();
    const html = await readFile(path);
    const bookmarks = parseBookmarks(html);
    const folders = parseFolders(html);

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

  return (
    <main className="w-full min-h-screen p-2 grid grid-cols-2 gap-2">
      <div className="h-full bg-slate-200">
        <h2>FOLDERS</h2>
        <hr />
        <div>
          {folders.map((folder, index) => (
            <p key={folder.title + index}>
              {folder.title} ({folder.folders.join("/")})
            </p>
          ))}
        </div>
      </div>
      <div className="h-full bg-slate-100">
        <h2>BOOKMARKS</h2>
        <hr />
        <div>
          {bookmarks.map((bookmark, index) => (
            <p key={bookmark.href + index}>
              {bookmark.title} ({bookmark.folders.join("/")})
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.warn(caught);

  if (caught.status === 404) {
    return (
      <Fallback title="Couldn't load bookmarks file" error={caught.data} />
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.warn(error);
  return <Fallback title="Something went wrong" error={error.message} />;
}
