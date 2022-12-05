import type { ActionArgs } from "@remix-run/node";
import { writeLinksFile } from "./saveToFile.utils";

export async function action({ request }: ActionArgs) {
  try {
    const { content } = Object.fromEntries(await request.formData());
    if (typeof content === "string") {
      await writeLinksFile(content);
      return new Response(null, { status: 204 });
    } else {
      throw new Response("Content field is missing", { status: 404 });
    }
  } catch (err) {
    console.log("err", err);
    throw new Response(
      err instanceof Error ? err.message : "Could not save selected bookmarks",
      { status: 500 }
    );
  }
}
