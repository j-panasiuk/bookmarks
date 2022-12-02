import type { Bookmark } from "~/models/bookmark";

type Props = {
  bookmarks: Bookmark[];
};

export function Bookmarks({ bookmarks }: Props) {
  return (
    <div>
      {bookmarks.map((bookmark, index) => (
        <p key={bookmark.title + index} className="flex">
          <img src={bookmark.icon ?? undefined} className="w-6 h-6" />
          {bookmark.title} ({bookmark.folders.join("/")})
        </p>
      ))}
    </div>
  );
}
