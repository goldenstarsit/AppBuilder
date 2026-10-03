"use client";

import { useEffect, useMemo, useState } from "react";

type Entity = {
  id: string;
  name: string;
  description: string;
};

type EntityCategory = {
  id: string;
  name: string;
  description: string;
};

type EntityRecord = Record<string, unknown>;

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
  const [entities, setEntities] = useState<Entity[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [entitiesError, setEntitiesError] = useState("");
  const [records, setRecords] = useState<EntityRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

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
    () => entities.find((entity) => entity.id === selectedEntityId),
    [entities, selectedEntityId],
  );

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    let cancelled = false;

    async function loadEntities() {
      try {
        setEntitiesLoading(true);
        setEntitiesError("");
        setEntities([]);
        setSelectedEntityId("");

        const response = await fetch(
          `/api/categories/${selectedCategoryId}/entities`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Failed to load entities.");
        }

        const data = (await response.json()) as Entity[];

        if (!cancelled) {
          setEntities(data);
        }
      } catch {
        if (!cancelled) {
          setEntitiesError("Unable to load entities.");
        }
      } finally {
        if (!cancelled) {
          setEntitiesLoading(false);
        }
      }
    }

    void loadEntities();

    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId || !selectedEntityId) {
      return;
    }

    let cancelled = false;

    async function loadRecords() {
      try {
        setRecordsLoading(true);
        setRecordsError("");
        setRecords([]);

        const response = await fetch(
          `/api/categories/${selectedCategoryId}/entities/${selectedEntityId}/records`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Failed to load records.");
        }

        const data = (await response.json()) as EntityRecord[];

        if (!cancelled) {
          setRecords(data);
        }
      } catch {
        if (!cancelled) {
          setRecordsError("Unable to load records.");
        }
      } finally {
        if (!cancelled) {
          setRecordsLoading(false);
        }
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId, selectedEntityId]);

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setSelectedEntityId("");
    setEntities([]);
    setEntitiesError("");
    setRecords([]);
    setRecordsError("");
  }

  const recordColumns = useMemo(() => {
    if (selectedCategory?.name === "tags") {
      return [
        { key: "id", label: "ID" },
        { key: "parent_tag_id", label: "Parent Tag" },
        { key: "tag_definition_id", label: "Tag Definition" },
      ];
    }

    if (selectedCategory?.name === "attributes") {
      return [
        { key: "id", label: "ID" },
        { key: "tag_id", label: "Tag ID" },
        { key: "name", label: "Name" },
        { key: "value", label: "Value" },
      ];
    }

    return records.length > 0
      ? Object.keys(records[0]).map((key) => ({
          key,
          label: key.replace(/_/g, " "),
        }))
      : [];
  }, [records, selectedCategory]);

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
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategoryId}
                  disabled={categoriesLoading}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : categoriesError
                        ? "Unable to load categories"
                        : "Select a category..."}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

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
              <select
                id="entity"
                value={selectedEntityId}
                disabled={!selectedCategoryId || entitiesLoading || !entities.length}
                onChange={(event) => setSelectedEntityId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {!selectedCategory
                    ? "Select category first..."
                    : entitiesLoading
                      ? "Loading entities..."
                      : entitiesError
                        ? "Unable to load entities"
                        : entities.length
                          ? "Select an entity..."
                          : "No entities available"}
                </option>
                {entities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>

              {entitiesError && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {entitiesError}
                  </p>
                </div>
              )}

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
                    Step 03
                  </p>
                  <h2 className="text-base font-semibold text-slate-900">
                    Defined Entities
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {selectedCategory
                  ? `All defined entities in ${selectedCategory.name}.`
                  : "Select a category to view its defined entities."}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">
                      ID
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">
                      Name
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">
                      Description
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">
                      Category
                    </th>
                  </tr>
                </thead>
                {selectedCategory && entities.length > 0 && (
                  <tbody className="divide-y divide-slate-100">
                    {entities.map((entity) => (
                      <tr
                        key={entity.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          {entity.id}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {entity.name}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {entity.description}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {selectedCategory.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
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
                    Step 04
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
                      {recordColumns.map((column) => (
                        <th
                          key={column.key}
                          className="px-5 py-3.5 font-semibold capitalize text-slate-600"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {!recordsLoading && records.length > 0 && (
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record, index) => (
                        <tr
                          key={String(record.id ?? index)}
                          className="transition-colors hover:bg-slate-50"
                        >
                          {recordColumns.map((column) => (
                            <td
                              key={column.key}
                              className="px-5 py-4 text-slate-600"
                            >
                              {String(record[column.key] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>

                {recordsLoading && (
                  <div className="px-5 py-4 text-sm text-slate-500">
                    Loading records...
                  </div>
                )}

                {recordsError && (
                  <div className="px-5 py-4 text-sm text-red-600">
                    {recordsError}
                  </div>
                )}
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
