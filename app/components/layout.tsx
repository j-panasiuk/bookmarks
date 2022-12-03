type Props = {
  header: JSX.Element;
  nav: JSX.Element;
  main: JSX.Element;
  aside?: JSX.Element;
};

export function Layout({ header, nav, main, aside }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-pink-100 mx-auto px-4 h-16">{header}</div>

      <div className="py-4">
        <div className="mx-auto sm:px-4 lg:grid lg:grid-cols-12 lg:gap-4">
          <div className="bg-yellow-100 hidden lg:col-span-3 lg:block xl:col-span-3">
            <nav
              aria-label="Sidebar"
              className="sticky top-4 divide-y divide-gray-300"
            >
              {nav}
            </nav>
          </div>
          <main className="bg-teal-100 lg:col-span-9 xl:col-span-6">
            {main}
          </main>
          <aside className="bg-green-100 hidden lg:col-span-3 lg:block">
            <div className="sticky top-4 space-y-4">{aside}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
