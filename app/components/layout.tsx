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
          "h-16 pr-4 mx-auto",
          "border-b border-gray-200"
        )}
      >
        {header}
      </div>

      <div className={c("mx-auto", "lg:grid lg:grid-cols-12")}>
        <div className={c("hidden", "lg:col-span-3 lg:block", "xl:col-span-3")}>
          <nav
            aria-label="Sidebar"
            className={c(
              "sticky top-0",
              "max-h-screen", // TODO there is some offset because of top header
              "overflow-y-auto",
              "py-3 px-3.5"
            )}
          >
            {nav}
          </nav>
        </div>

        <main
          className={c(
            "bg-slate-100",
            "py-3 px-3.5",
            "lg:col-span-9",
            "xl:col-span-6"
          )}
        >
          {main}
        </main>

        <aside className={c("hidden", "lg:col-span-3 lg:block")}>
          <div className={c("sticky top-4 space-y-4")}>{aside}</div>
        </aside>
      </div>
    </div>
  );
}
