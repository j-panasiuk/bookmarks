import { classes as c } from "~/utils/classes";

type Props = {
  header: JSX.Element;
  nav: JSX.Element;
  main: JSX.Element;
  aside?: JSX.Element;
};

export function Layout({ header, nav, main, aside }: Props) {
  return (
    <div className={c("min-h-screen", "bg-gray-100")}>
      <div
        className={c(
          "flex flex-1 items-center justify-between",
          "h-16 pr-4 mx-auto",
          "border-b border-gray-200 bg-white"
        )}
      >
        {header}
      </div>

      <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-4">
        <div className={c("hidden lg:col-span-3 lg:block xl:col-span-3")}>
          <nav aria-label="Sidebar" className={c("sticky", "py-3 px-3.5")}>
            {nav}
          </nav>
        </div>
        <main className="lg:col-span-9 xl:col-span-6">{main}</main>
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-4 space-y-4">{aside}</div>
        </aside>
      </div>
    </div>
  );
}
