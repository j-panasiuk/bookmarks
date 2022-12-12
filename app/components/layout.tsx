import { classes as c } from "~/utils/classes";

type Props = {
  header: JSX.Element;
  nav: JSX.Element;
  main: JSX.Element;
  aside?: JSX.Element;
};

export function Layout({ header, nav, main, aside }: Props) {
  return (
    <div className={c("min-h-screen", "bg-white")}>
      <div
        className={c(
          "md:grid md:grid-cols-12",
          "items-center justify-center",
          "mx-auto h-app/header",
          "border-b border-gray-200"
        )}
      >
        <div
          className={c(
            "hidden",
            "xl:col-span-3 xl:block",
            "h-full border-r border-gray-200"
          )}
        ></div>
        {header}
      </div>

      <div className={c("mx-auto h-app/main", "md:grid md:grid-cols-12")}>
        <aside className={c("hidden", "xl:col-span-3 xl:block")}>
          <nav
            aria-label="Sidebar"
            className={c(
              "sticky top-0",
              "h-max-full overflow-y-auto py-3 px-3.5",
              "border-r border-gray-200"
            )}
          >
            {nav}
          </nav>
        </aside>

        <main
          className={c(
            "h-max-full overflow-y-auto py-3 px-3.5",
            "bg-slate-100",
            "md:col-span-8",
            "xl:col-span-6"
          )}
        >
          {main}
        </main>

        <aside
          className={c(
            "todo",
            "hidden border-l",
            "border-gray-200 bg-slate-100",
            "md:col-span-4 md:block",
            "xl:col-span-3"
          )}
        >
          <div className={c("sticky top-4 space-y-4")}>{aside}</div>
        </aside>
      </div>
    </div>
  );
}
