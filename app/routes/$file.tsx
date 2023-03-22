import { type LoaderArgs, json } from "@remix-run/node";
import { type Params, useLoaderData } from "@remix-run/react";
import { HTMLProps, useEffect, useState } from "react";
import { useBreadcrumbs } from "~/bookmarks.breadcrumbs";
import { readFileContent, getUploadedFileNames } from "~/bookmarks.file";
import { withExtension } from "~/bookmarks.file.utils";
import { parseBookmarks, parseFolderTree } from "~/bookmarks.parser.server";
import type { Bookmark } from "~/bookmarks.types";
import { isSameAs } from "~/bookmarks.utils";
import { Layout } from "~/components/layout";
import { NavigationMenu } from "~/components/navigationMenu";
import { UploadButton } from "~/components/uploadButton";
import {
  SelectionPanel,
  SelectionPanelButton,
} from "~/components/selectionPanel";
import { SearchBox, SearchOptions } from "~/components/searchBox";
import { FoldersNav } from "~/components/folders";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Bookmarks } from "~/components/bookmarks";
import { assertExists } from "~/utils/assert";
import { c } from "~/utils/classes";
import { useSelection } from "~/utils/selection";
import { log, logError } from "~/utils/console";

// --- READ BOOKMARKS FILE ---

export async function loader({ params }: LoaderArgs) {
  try {
    const { file }: Params<typeof param> = params;

    log("loader /$file", file);
    assertExists(file);

    const fileNames = await getUploadedFileNames();
    const fileName = withExtension(file);
    const html = await readFileContent(fileName);
    const bookmarks = parseBookmarks(html);
    const folders = parseFolderTree(html);

    log("loader /$file", fileName);
    return json({ fileNames, fileName, bookmarks, folders });
  } catch (err) {
    logError("loader /$file", (err as any)?.message);

    throw new Response(
      err instanceof Error ? err.message : "Failed to load bookmarks",
      {
        status:
          err instanceof Error && typeof err.cause === "number"
            ? err.cause
            : 500,
      }
    );
  }
}

export default function BookmarksFileRoute() {
  const { fileNames, fileName, bookmarks, folders } =
    useLoaderData<typeof loader>();

  const [breadcrumbs, setCurrentFolder] = useBreadcrumbs(folders);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedBookmarks, selectionActions] = useSelection<Bookmark>({
    eq: isSameAs,
  });
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  // Current folder being `undefined` means it's top-level "Bookmarks bar"
  const currentFolder = breadcrumbs.at(-1);
  const resetSelection = selectionActions.reset;

  useEffect(() => {
    // Reset client state on file change
    // (bookmarks and folders most likely differ between file versions)
    setCurrentFolder();
    setSearchPhrase("");
    resetSelection();
  }, [fileName, resetSelection]);

  return (
    <Layout
      header={
        <>
          <Row>
            <NavigationMenu fileName={fileName} fileNames={fileNames} />
            <UploadButton />
          </Row>
          <Row>
            {selectedBookmarks.length > 0 ? (
              <SelectionPanelButton
                selectedCount={selectedBookmarks.length}
                setOpen={setPanelIsOpen}
              />
            ) : null}
          </Row>
        </>
      }
      breadcrumbs={
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          setCurrentFolder={setCurrentFolder}
        />
      }
      search={
        <>
          <SearchBox
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
          />
          <SearchOptions />
        </>
      }
      sidebar={
        <FoldersNav
          folders={folders}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
        />
      }
      results={
        <Bookmarks
          bookmarks={bookmarks}
          folders={folders}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          searchPhrase={searchPhrase}
          bookmarksSelection={selectionActions}
        />
      }
      panel={
        <SelectionPanel
          open={panelIsOpen}
          setOpen={setPanelIsOpen}
          selectedBookmarks={selectedBookmarks}
        />
      }
    />
  );
}

function Row({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={c("flex flex-row space-x-2", className)} {...props} />;
}

// --- ROUTE ---

const param = "file";

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("param", () => {
    it("matches file name", () => {
      expect(import.meta.url.split("/").at(-1)).toBe("$" + param + ".tsx");
    });
  });
}
