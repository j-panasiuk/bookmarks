import { c } from "~/utils/classes";
import { useIsLargeDevice } from "~/utils/responsive";

type Props = {
  header: JSX.Element;
  breadcrumbs?: JSX.Element;
  search?: JSX.Element;
  sidebar?: JSX.Element;
  results?: JSX.Element;
  panel?: JSX.Element;
};

export function Layout({
  header,
  breadcrumbs,
  search,
  sidebar,
  results,
  panel,
}: Props) {
  const lg = useIsLargeDevice();

  return (
    <div className={c("min-h-screen", "bg-white")}>
      <header
        className={c(
          "flex flex-row items-center justify-between",
          "h-app/header px-2",
          "bg-indigo-600 text-white"
        )}
      >
        {header}
      </header>

      <main className={c("mx-auto h-app/main", "md:grid md:grid-cols-3")}>
        <section
          className={c(
            "hidden",
            "lg:col-span-1 lg:flex lg:flex-col",
            "bg-slate-800 text-white"
          )}
        >
          <nav
            aria-label="Sidebar"
            className={c(
              "sticky top-0",
              "max-h-full space-y-2 overflow-y-auto p-2",
              "flex flex-1 flex-col",
              "border-r border-gray-200"
            )}
          >
            {lg ? search : null}
            {sidebar}
          </nav>
        </section>

        <section
          className={c(
            "max-h-full space-y-2 overflow-y-auto p-2",
            "flex flex-1 flex-col",
            "bg-slate-100",
            "col-span-full",
            "lg:col-span-2"
          )}
        >
          {lg ? null : search}
          {breadcrumbs}
          {results}
        </section>
      </main>

      {panel}
    </div>
  );
}
