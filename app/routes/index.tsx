import { useLoaderData } from "@remix-run/react";
import { getBookmarkTree } from "~/models/bookmark";
import { readFile } from "~/utils/readFile";

export async function loader() {
  if (!process.env.BOOKMARKS_FILE_PATH) {
    throw new Error('Missing env variable "BOOKMARKS_FILE_PATH"');
  }

  const url = process.env.HOME + process.env.BOOKMARKS_FILE_PATH;
  const html = await readFile(url);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.warn(error);
  return <div>Something went wrong</div>;
}
