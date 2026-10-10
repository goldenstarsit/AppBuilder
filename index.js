(() => {  "use strict";

  const $ = id => document.getElementById(id);
  const tableSelect = $("tableSelect");
  const platformSelect = $("platformSelect");
  const categorySelect = $("categorySelect");
  const categoryStatus = $("categoryStatus");
  const searchInput = $("searchInput");
  const recordsContent = $("recordsContent");
  const schemaContent = $("schemaContent");
  const statusMessage = $("statusMessage");
  const tableCount = $("tableCount");
  const recordCount = $("recordCount");
  const columnCount = $("columnCount");
  const tableBadge = $("tableBadge");
  const selectedTableName = $("selectedTableName");
  const visibleCount = $("visibleCount");
  const refreshButton = $("refreshButton");
  const themeButton = $("themeButton");
  const root = document.documentElement;

  let tables = [];
  let selectedTable = null;

  function element(tag, className = "", value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  }

  function empty(container, title, description = "") {
    container.replaceChildren();
    container.className = "empty-state";
    container.append(element("strong", "", title));
    if (description) container.append(document.createTextNode(description));
  }

  function valueText(value) {
    if (value === null || value === undefined) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  }

  function columnsFor(table) {
    const declared = Array.isArray(table?.schema?.columns)
      ? table.schema.columns.map(column => {
          if (typeof column === "string") return column;
          return column?.name ?? column?.column ?? column?.key ?? "";
        }).filter(Boolean)
      : [];
    const discovered = (table?.rows ?? []).flatMap(row =>
      row && typeof row === "object" ? Object.keys(row) : []
    );
    return [...new Set([...declared, ...discovered])];
  }

  function renderRecords() {
    if (!selectedTable) {
      empty(recordsContent, "No table selected", "Choose an available table above.");
      visibleCount.textContent = "";
      return;
    }

    const columns = columnsFor(selectedTable);
    const query = searchInput.value.trim().toLowerCase();
    const allRows = selectedTable.rows ?? [];
    const rows = allRows.filter(row =>
      !query || columns.some(column =>
        valueText(row?.[column]).toLowerCase().includes(query)
      )
    );

    visibleCount.textContent = `${rows.length} of ${allRows.length} records`;
    recordsContent.replaceChildren();

    if (!columns.length || !rows.length) {
      empty(
        recordsContent,
        query ? "No matching records" : "This table is empty",
        query ? "Try another search term." : "No records are stored in this table."
      );
      return;
    }

    recordsContent.className = "table-scroll";
    const table = element("table");
    const thead = element("thead");
    const headerRow = element("tr");

    for (const column of columns) {
      const th = element("th", "", column);
      th.scope = "col";
      headerRow.append(th);
    }

    thead.append(headerRow);
    table.append(thead);
    const tbody = element("tbody");

    for (const row of rows) {
      const tr = element("tr");
      for (const column of columns) {
        tr.append(element("td", "", valueText(row?.[column])));
      }
      tbody.append(tr);
    }

    table.append(tbody);
    recordsContent.append(table);
  }

  function renderSchema() {
    if (!selectedTable) {
      empty(schemaContent, "No schema selected", "Choose a table to inspect its columns.");
      return;
    }

    const columns = Array.isArray(selectedTable.schema?.columns)
      ? selectedTable.schema.columns
      : [];

    if (!columns.length) {
      empty(schemaContent, "No column definitions", "No columns are declared in this schema.");
      return;
    }

    schemaContent.replaceChildren();
    schemaContent.className = "schema-grid";

    for (const column of columns) {
      const definition = typeof column === "string" ? { name: column } : column;
      const name = definition?.name ?? definition?.column ?? definition?.key ?? "Unnamed column";
      const details = Object.entries(definition ?? {})
        .filter(([key]) => !["name", "column", "key"].includes(key))
        .map(([key, value]) => `${key}: ${valueText(value)}`);

      const item = element("div", "schema-item");
      item.append(element("div", "schema-column", name));
      item.append(element("div", "schema-type", details.length ? details.join(" · ") : "Column"));
      schemaContent.append(item);
    }
  }

  function selectTable(name) {
    selectedTable = tables.find(table => table.name === name) ?? null;
    searchInput.value = "";
    searchInput.disabled = !selectedTable;
    tableBadge.textContent = selectedTable?.name ?? "No table selected";
    selectedTableName.textContent = selectedTable?.name ?? "Select a table";
    recordCount.textContent = selectedTable ? String(selectedTable.rows.length) : "—";
    columnCount.textContent = selectedTable ? String(columnsFor(selectedTable).length) : "—";
    renderRecords();
    renderSchema();
  }

  async function requestJson(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status}).`);
    }
    return data;
  }

  async function loadPlatforms() {
    if (!platformSelect) return;

    platformSelect.disabled = true;
    platformSelect.replaceChildren(new Option("Loading platforms…", ""));

    try {
      const table = await requestJson("/api/tables/platform");
      if (!Array.isArray(table.rows)) {
        throw new Error("Invalid platform table response.");
      }

      platformSelect.replaceChildren(new Option("Select a platform…", ""));
      for (const row of table.rows) {
        if (typeof row.name === "string") {
          platformSelect.append(new Option(row.name, row.name));
        }
      }
    } catch (error) {
      platformSelect.replaceChildren(new Option("Could not load platforms", ""));
      console.error("Unable to load platforms:", error);
    } finally {
      platformSelect.disabled = false;
      await loadCategories();
    }
  }


  function categoryFlagName(platformName) {
    const words = String(platformName || "").match(/[A-Za-z0-9]+/g) || [];
    return words.length
      ? words[0].toLowerCase() + words.slice(1).map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join("")
      : "";
  }

  async function loadCategories() {
    if (!categorySelect) return;

    const platformName = platformSelect?.value || "";
    if (!platformName) {
      categorySelect.disabled = true;
      categorySelect.replaceChildren(new Option("Select a platform first…", ""));
      if (categoryStatus) categoryStatus.textContent = "Choose a platform to load categories.";
      return;
    }

    categorySelect.disabled = true;
    categorySelect.replaceChildren(new Option("Loading categories…", ""));
    if (categoryStatus) categoryStatus.textContent = "Loading categories…";

    try {
      const table = await requestJson("/api/tables/category");
      if (!Array.isArray(table.rows)) throw new Error("Invalid category table response.");

      const flag = categoryFlagName(platformName);
      const matching = table.rows.filter(row => row[flag] === true);
      categorySelect.replaceChildren(
        new Option(matching.length ? "Select a category…" : "No categories available", "")
      );

      for (const row of matching) {
        if (typeof row.name === "string") {
          categorySelect.append(new Option(row.name, row.name));
        }
      }

      if (categoryStatus) {
        categoryStatus.textContent = matching.length
          ? `${matching.length} categories available for ${platformName}.`
          : `No categories are enabled for ${platformName}.`;
      }
    } catch (error) {
      categorySelect.replaceChildren(new Option("Could not load categories", ""));
      if (categoryStatus) categoryStatus.textContent = error.message || "Could not load categories.";
      console.error("Unable to load categories:", error);
    } finally {
      categorySelect.disabled = false;
    }
  }

  async function loadTables() {
    refreshButton.disabled = true;
    tableSelect.disabled = true;
    statusMessage.className = "status";
    statusMessage.textContent = "Loading tables…";

    const previousName = tableSelect.value;

    try {
      const list = await requestJson("/api/tables");
      if (!Array.isArray(list)) throw new Error("Invalid table-list response.");

      const loaded = await Promise.all(list.map(async entry => {
        if (!entry || typeof entry.name !== "string") return null;
        const table = await requestJson(`/api/tables/${encodeURIComponent(entry.name)}`);
        if (typeof table.name !== "string" || !Array.isArray(table.rows)) {
          throw new Error(`Invalid response for table "${entry.name}".`);
        }
        return table;
      }));

      tables = loaded.filter(Boolean);
      tableCount.textContent = String(tables.length);
      tableSelect.replaceChildren();

      if (!tables.length) {
        tableSelect.append(new Option("No tables available", ""));
        selectTable("");
        statusMessage.textContent = "No table schemas were found.";
        return;
      }

      tableSelect.append(new Option("Select a table…", ""));
      for (const table of tables) {
        tableSelect.append(new Option(table.name, table.name));
      }

      const nextName = tables.some(table => table.name === previousName)
        ? previousName
        : tables[0].name;

      tableSelect.value = nextName;
      selectTable(nextName);
      statusMessage.textContent = `Loaded ${tables.length} table${tables.length === 1 ? "" : "s"}.`;
    } catch (error) {
      tables = [];
      tableCount.textContent = "—";
      recordCount.textContent = "—";
      columnCount.textContent = "—";
      tableSelect.replaceChildren(new Option("Could not load tables", ""));
      selectTable("");
      statusMessage.className = "status error";
      statusMessage.textContent = error.message || "Could not load table data.";
    } finally {
      tableSelect.disabled = false;
      refreshButton.disabled = false;
    }
  }

  function setTheme(theme, persist = true) {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    $("themeIcon").textContent = dark ? "☀" : "☾";
    themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.title = dark ? "Switch to light mode" : "Switch to dark mode";
    $("themeColor").content = dark ? "#11131d" : "#f5f7fc";

    if (persist) {
      try {
        localStorage.setItem("appbuilder-theme", theme);
      } catch {
        // Theme still works when browser storage is unavailable.
      }
    }
  }

  platformSelect?.addEventListener("change", loadCategories);
  tableSelect?.addEventListener("change", () => selectTable(tableSelect.value));
  searchInput?.addEventListener("input", renderRecords);
  refreshButton?.addEventListener("click", loadTables);
  themeButton?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  try {
    setTheme(localStorage.getItem("appbuilder-theme") === "dark" ? "dark" : "light", false);
  } catch {
    setTheme("light", false);
  }

  loadPlatforms();
  loadTables();
})();
