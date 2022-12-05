import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Bookmarks } from "~/components/bookmarks";
import { BookmarkSelection } from "~/components/bookmarkSelection";
import { Fallback } from "~/components/fallback";
import { FoldersNav } from "~/components/folders";
import { Layout } from "~/components/layout";
import { Bookmark, Folder, isSameAs } from "~/models/bookmark";
import { parseBookmarks, parseFolderTree } from "~/models/bookmark.server";
import { useSelection } from "~/utils/selection";
import { readBookmarksFile } from "./index.utils";

export async function loader() {
  try {
    const html = await readBookmarksFile();
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
      header={<>Bookmarks</>}
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
