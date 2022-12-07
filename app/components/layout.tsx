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
          "border-b border-gray-200"
        )}
      >
        {header}
      </div>

      <div className={c("h-app/main mx-auto", "md:grid md:grid-cols-12")}>
        <aside className={c("hidden", "xl:block xl:col-span-3")}>
          <nav
            aria-label="Sidebar"
            className={c(
              "sticky top-0",
              "h-max-full py-3 px-3.5 overflow-y-auto",
              "border-r border-gray-200"
            )}
          >
            {nav}
          </nav>
        </aside>

        <main
          className={c(
            "h-max-full py-3 px-3.5 overflow-y-auto",
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
            "md:block md:col-span-4",
            "xl:col-span-3"
          )}
        >
          <div className={c("sticky top-4 space-y-4")}>{aside}</div>
        </aside>
      </div>
    </div>
  );
}
