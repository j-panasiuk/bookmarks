import { useCatch, useLoaderData } from "@remix-run/react";
import { Fallback } from "~/components/fallback";
import { getBookmarkTree } from "~/models/bookmark";
import { readFile } from "~/utils/readFile";

export async function loader() {
  if (!process.env.BOOKMARKS_FILE_PATH) {
    throw new Response('Missing env variable "BOOKMARKS_FILE_PATH"', {
      status: 404,
    });
  }

  try {
    const html = await readFile(process.env.BOOKMARKS_FILE_PATH);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
  } catch (err) {
    throw new Response(
      err instanceof Error ? err.message : "Could not read bookmarks file",
      { status: 404 }
    );
  }
}

export default function IndexRoute() {
  const html = useLoaderData<typeof loader>();

  if (typeof DOMParser !== "undefined") {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const tree = getBookmarkTree(dom);
    console.log(tree);
  }

  return (
    <main className="w-full min-h-screen p-4">
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
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
