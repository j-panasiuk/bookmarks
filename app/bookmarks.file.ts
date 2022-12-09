export async function getBookmarksHtml(file: File): Promise<string> {
  if (!isValidFileType(file)) {
    throw new Error(
      [`Invalid file format: ${file.type}.`, `Expected a .html file.`].join(
        "\n"
      )
    );
  }
  const text = await file.text();
  if (!isValidBookmarksHtml(text)) {
    throw new Error(
      [
        `Invalid file content.`,
        `Expected a .html file with a "<!DOCTYPE NETSCAPE-Bookmark-file-1>" opening tag.`,
      ].join("\n")
    );
  }
  return text;
}

function isValidFileType(file: File): boolean {
  return file.type === "text/html";
}

function isValidBookmarksHtml(val: string): boolean {
  return val.startsWith("<!DOCTYPE NETSCAPE-Bookmark-file-1>");
}
