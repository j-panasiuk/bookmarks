import type { ActionArgs } from "@remix-run/node";
import { join } from "path";
import { writeTextFile } from "~/utils/file";

export async function action({ request }: ActionArgs) {
  try {
    const { content } = Object.fromEntries(await request.formData());
    if (typeof content === "string") {
      await writeTextFile(
        process.env.EXPORT_LINKS_FILE_PATH || join(__dirname, DEFAULT_PATH),
        content
      );
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

const DEFAULT_PATH = "../example/links.txt";
