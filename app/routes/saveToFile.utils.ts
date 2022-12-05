import { join } from "path";
import { writeTextFile } from "~/utils/file";

export async function writeLinksFile(content: string): Promise<void> {
  const path = getFilePath();
  return await writeTextFile(path, content);
}

const DEFAULT_PATH = "../example/links.txt";

function getFilePath(): string {
  return process.env.EXPORT_LINKS_FILE_PATH || join(__dirname, DEFAULT_PATH);
}
