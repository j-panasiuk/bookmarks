import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { c } from "~/utils/classes";

type Props = {
  searchPhrase: string;
  setSearchPhrase: (phrase: string) => void;
};

export function SearchBox({ searchPhrase, setSearchPhrase }: Props) {
  return (
    <div className="flex h-10 flex-row">
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <div className="relative w-full text-slate-100 focus-within:text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <MagnifyingGlassIcon
            className="ml-2 mr-1 h-5 w-5 stroke-indigo-100"
            aria-hidden="true"
          />
        </div>
        <input
          id="search-field"
          className={c(
            "block h-full w-full rounded border-indigo-400 bg-transparent py-2 pl-8 pr-3 text-slate-100 placeholder-slate-500",
            "sm:text-sm",
            "hover:border-indigo-300",
            "focus:border-indigo-300 focus:text-white focus:placeholder-slate-400 focus:outline-none focus:ring-0"
          )}
          placeholder="Search"
          type="search"
          name="search"
          value={searchPhrase}
          onChange={(ev) => setSearchPhrase(ev.target.value)}
          autoFocus
        />
      </div>
    </div>
  );
}

export function SearchOptions() {
  return (
    <div className="flex h-8 items-center justify-end px-2 text-sm">
      Search advanced options...{/** TODO */}
    </div>
  );
}
