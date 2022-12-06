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
          "flex flex-1 items-center justify-between",
          "h-app/header pr-4 mx-auto",
          "border-b border-gray-200",
          "todo"
        )}
      >
        {header}
      </div>

      <div className={c("mx-auto h-app/main", "lg:grid lg:grid-cols-12")}>
        <div className={c("hidden", "lg:col-span-3 lg:block", "xl:col-span-3")}>
          <nav
            aria-label="Sidebar"
            className={c(
              "sticky top-0",
              "h-max-full overflow-y-auto",
              "py-3 px-3.5",
              "border-r border-gray-200"
            )}
          >
            {nav}
          </nav>
        </div>

        <main
          className={c(
            "h-max-full overflow-y-auto",
            "py-3 px-3.5",
            "bg-slate-100",
            "lg:col-span-9",
            "xl:col-span-6"
          )}
        >
          {main}
        </main>

        <aside
          className={c(
            "hidden border-l border-gray-200",
            "bg-slate-100",
            "lg:col-span-3 lg:block",
            "todo"
          )}
        >
          <div className={c("sticky top-4 space-y-4")}>{aside}</div>
        </aside>
      </div>
    </div>
  );
}
