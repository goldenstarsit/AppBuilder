"use client";

import { useEffect, useMemo, useState } from "react";

type Entity = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft";
  updated: string;
};

type EntityCategory = {
  id: string;
  name: string;
  description: string;
  count: number;
  entities: Entity[];
};

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function SearchableSelect({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
  onAdd,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: { id: string; name: string; count?: number }[];
  disabled?: boolean;
  onChange: (value: string) => void;
  onAdd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) =>
      option.name.toLowerCase().includes(query),
    );
  }, [options, search]);

  const selectedOption = options.find((option) => option.id === value);

  function selectOption(id: string) {
    onChange(id);
    setOpen(false);
    setSearch("");
  }

  function toggleOpen() {
    if (disabled) return;

    setOpen((current) => {
      if (!current) setSearch("");
      return !current;
    });
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption
            ? `${selectedOption.name}${
                selectedOption.count !== undefined
                  ? ` (${selectedOption.count})`
                  : ""
              }`
            : placeholder}
        </span>

        <span
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <div className="flex items-center gap-2 border-b border-slate-100 p-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon />
                </span>

                <input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setOpen(false);
                  }}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={onAdd}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                aria-label={`Add ${label.toLowerCase()}`}
                title={`Add ${label}`}
              >
                <PlusIcon />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-1.5" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={option.id === value}
                    onClick={() => selectOption(option.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      option.id === value
                        ? "bg-slate-100 font-medium text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="min-w-0 truncate">{option.name}</span>

                    {option.count !== undefined && (
                      <span className="ml-3 shrink-0 text-xs text-slate-400">
                        {option.count}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No results found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try a different search term.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function CategoryIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h3A2.5 2.5 0 0 1 12 6.5v3A2.5 2.5 0 0 1 9.5 12h-3A2.5 2.5 0 0 1 4 9.5v-3ZM12 14.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v-3ZM14.5 4h3A2.5 2.5 0 0 1 20 6.5v3a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 12 9.5v-3A2.5 2.5 0 0 1 14.5 4Z"
      />
    </svg>
  );
}

function EntityIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 8h7M8.5 12h7M8.5 16h4"
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path
        strokeLinecap="round"
        d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"
      />
      <path
        strokeLinecap="round"
        d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"
      />
    </svg>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <DatabaseIcon />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<EntityCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response = await fetch("/api/categories", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }

        const data = (await response.json()) as EntityCategory[];

        if (!cancelled) {
          setCategories(data);
        }
      } catch {
        if (!cancelled) {
          setCategoriesError("Unable to load categories.");
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const selectedEntity = useMemo(
    () =>
      selectedCategory?.entities.find(
        (entity) => entity.id === selectedEntityId,
      ),
    [selectedCategory, selectedEntityId],
  );

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setSelectedEntityId("");
  }

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm sm:h-14 sm:w-14">
              <DatabaseIcon />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                AppBuilder
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Select a category, choose an entity, and manage its data from
                one workspace.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-3 lg:items-start">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <CategoryIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Step 01
                  </p>
                  <h2 className="text-base font-semibold text-slate-900">
                    Entity Category
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Choose the category containing the entity you want to manage.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <SearchableSelect
                label="Category"
                placeholder={
                  categoriesLoading
                    ? "Loading categories..."
                    : categoriesError
                      ? "Unable to load categories"
                      : "Select a category..."
                }
                value={selectedCategoryId}
                options={categories.map((category) => ({
                  id: category.id,
                  name: category.name,
                  count: category.count,
                }))}
                disabled={categoriesLoading}
                onChange={handleCategoryChange}
                onAdd={() => {
                  // Reserved for the category creation workflow.
                }}
              />

              {categoriesError && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {categoriesError}
                  </p>
                </div>
              )}

              {selectedCategory && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">
                    {selectedCategory.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    {selectedCategory.description}
                  </p>
                </div>
              )}
            </div>
          </article>

          <article
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
              selectedCategory
                ? "border-slate-200 hover:shadow-md"
                : "border-slate-200/80"
            }`}
          >
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selectedCategory
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-50 text-slate-300"
                  }`}
                >
                  <EntityIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Step 02
                  </p>
                  <h2 className="text-base font-semibold text-slate-900">
                    Entity
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {selectedCategory
                  ? `Select an entity from ${selectedCategory.name}.`
                  : "Select a category first to load its entities."}
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <SearchableSelect
                label="Entity"
                placeholder={
                  !selectedCategory
                    ? "Select category first..."
                    : selectedCategory.entities.length
                      ? "Select an entity..."
                      : "No entities available"
                }
                value={selectedEntityId}
                disabled={
                  !selectedCategory || !selectedCategory.entities.length
                }
                options={
                  selectedCategory?.entities.map((entity) => ({
                    id: entity.id,
                    name: entity.name,
                  })) ?? []
                }
                onChange={setSelectedEntityId}
                onAdd={() => {
                  // Reserved for the entity creation workflow.
                }}
              />

              {selectedEntity && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">
                    {selectedEntity.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    {selectedEntity.description}
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-w-0">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selectedEntity
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-50 text-slate-300"
                  }`}
                >
                  <DatabaseIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Step 03
                  </p>
                  <h2 className="text-base font-semibold text-slate-900">
                    Entity Data
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {selectedEntity
                  ? `Data for ${selectedEntity.name}`
                  : "Select an entity to view its data."}
              </p>
            </div>

            {selectedEntity ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold text-slate-600">
                        ID
                      </th>
                      <th className="px-5 py-3.5 font-semibold text-slate-600">
                        Name
                      </th>
                      <th className="px-5 py-3.5 font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="px-5 py-3.5 font-semibold text-slate-600">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {selectedEntity.id}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {selectedEntity.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {selectedEntity.description}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            selectedEntity.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {selectedEntity.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                        {selectedEntity.updated}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No entity selected"
                description="Choose an entity from the second card to display its records here."
              />
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
