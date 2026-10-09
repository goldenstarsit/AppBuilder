import { getAll } from "./core/tableStorage.js";

export function getDashboard() {
  return {
    name: "AppBuilder",
    environmentDetails: getAll("environmentDetails")
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function environmentIcon(environment) {
  const icons = {
    web: "W",
    electron: "E",
    expo: "M",
    babylon: "G",
    nextjs: "N"
  };

  return icons[environment] ?? "•";
}

function renderEnvironmentRows(rows) {
  return rows
    .map(
      (row) => `
        <tr data-search="${escapeHtml(
          `${row.environment} ${row.type} ${row.description} ${row.decoder}`
        )}">
          <td>
            <div class="environment-cell">
              <div class="environment-icon">
                ${escapeHtml(environmentIcon(row.environment))}
              </div>

              <div>
                <div class="environment-name">
                  ${escapeHtml(row.environment)}
                </div>

                <div class="environment-id">
                  ID ${escapeHtml(row.id)}
                </div>
              </div>
            </div>
          </td>

          <td>
            <span class="type-badge">
              ${escapeHtml(row.type)}
            </span>
          </td>

          <td>
            <span class="description">
              ${escapeHtml(row.description)}
            </span>
          </td>

          <td>
            <code>${escapeHtml(row.decoder)}</code>
          </td>

          <td class="actions-cell">
            <button
              class="icon-button"
              type="button"
              aria-label="More actions"
            >
              ⋮
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

export function renderDashboard() {
  const categories = getAll("categories");
  const dashboard = getDashboard();
  const environments = dashboard.environmentDetails;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f6f7fb" id="themeColor">
  <title>${escapeHtml(dashboard.name)} — Dashboard</title>

  <script>
    (() => {
      const saved = localStorage.getItem("appbuilder-theme");
      const dark = saved === "dark" ||
        (saved !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.dataset.theme = "dark";
    })();
  </script>

  <style>
    :root {
      color-scheme: light;
      --bg: #f5f7fc;
      --surface: #ffffff;
      --text: #171a2b;
      --muted: #72798d;
      --border: #e5e8f1;
      --accent: #5b5bd6;
      --accent-hover: #4949bf;
      --accent-soft: #eeeeff;
      --shadow: 0 20px 60px rgba(35, 39, 85, .09);
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --bg: #10121b;
      --surface: #191c29;
      --text: #f3f4ff;
      --muted: #a0a6bc;
      --border: #2b3042;
      --accent: #9999ff;
      --accent-hover: #b2b2ff;
      --accent-soft: #292947;
      --shadow: 0 20px 60px rgba(0, 0, 0, .25);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-width: 280px;
      min-height: 100vh;
      background:
        radial-gradient(ellipse at 50% 0%, var(--accent-soft), transparent 48%),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: background .2s ease, color .2s ease;
    }

    button, select { font: inherit; }

    .topbar {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      min-height: 76px;
      padding: 14px clamp(16px, 4vw, 44px);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .topbar-title {
      grid-column: 2;
      margin: 0;
      font-size: 1.12rem;
      font-weight: 750;
      letter-spacing: -.035em;
      text-align: center;
    }

    .theme-button {
      grid-column: 3;
      justify-self: end;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      color: var(--text);
      font-size: 1.25rem;
      cursor: pointer;
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }

    #configurationButton {
      grid-column: 1;
      justify-self: start;
    }

    .theme-button:hover {
      background: var(--accent-soft);
      border-color: var(--accent);
      transform: translateY(-1px);
    }

    .theme-button:focus-visible,
    .environment-select:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: 3px;
    }

    .main {
      width: min(100% - 32px, 760px);
      margin: 0 auto;
      padding: clamp(52px, 10vw, 104px) 0 80px;
    }

    .app-title {
      margin: 0 0 42px;
      text-align: center;
    }

    .app-title h1 {
      margin: 0;
      font-size: clamp(2.5rem, 8vw, 4.6rem);
      line-height: 1.08;
      letter-spacing: -.075em;
      font-weight: 850;
      background: linear-gradient(115deg, var(--text) 18%, var(--accent) 88%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .dashboard-card {
      padding: clamp(22px, 5vw, 36px);
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .field-label {
      display: block;
      margin-bottom: 13px;
      font-size: .96rem;
      font-weight: 700;
      letter-spacing: -.01em;
    }

    .environment-select {
      display: block;
      width: 100%;
      min-height: 56px;
      padding: 0 46px 0 16px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background-color: var(--bg);
      color: var(--text);
      cursor: pointer;
    }

    .environment-select:hover { border-color: var(--accent); }

    .table-ui {
      margin-top: 24px;
      overflow: hidden;
    }

    .table-ui-description {
      margin: -4px 0 18px;
      color: var(--muted);
      font-size: .9rem;
    }

    .table-ui-scroll {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 14px;
    }

    .table-ui table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .table-ui th,
    .table-ui td {
      padding: 13px 15px;
      border-bottom: 1px solid var(--border);
      overflow-wrap: anywhere;
      vertical-align: top;
    }

    .table-ui th {
      background: var(--bg);
      font-size: .82rem;
      font-weight: 750;
    }

    .table-ui td:first-child {
      width: 35%;
      color: var(--muted);
      font-weight: 650;
    }

    .table-ui tbody tr:last-child td {
      border-bottom: 0;
    }

    .table-ui-empty {
      padding: 24px 16px;
      border: 1px dashed var(--border);
      border-radius: 14px;
      color: var(--muted);
      text-align: center;
    }



    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(10, 12, 25, .58);
      backdrop-filter: blur(5px);
    }
    .modal-backdrop[hidden] { display: none; }
    .configuration-modal {
      width: min(100%, 520px);
      max-height: min(90vh, 760px);
      overflow-y: auto;
      padding: clamp(20px, 5vw, 32px);
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
      color: var(--text);
      box-shadow: var(--shadow);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .modal-title {
      margin: 0;
      font-size: 1.45rem;
      letter-spacing: -.04em;
    }
    .modal-close {
      width: 40px;
      height: 40px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--bg);
      color: var(--text);
      cursor: pointer;
      font-size: 1.3rem;
    }
    .configuration-fields { display: grid; gap: 18px; }
    .configuration-field label {
      display: block;
      margin-bottom: 8px;
      font-size: .9rem;
      font-weight: 700;
    }
    .configuration-field input,
    .configuration-field select {
      width: 100%;
      min-height: 48px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--bg);
      color: var(--text);
      font: inherit;
    }
    .configuration-field input[type="color"] {
      padding: 5px;
      cursor: pointer;
    }
    .configuration-field input:focus-visible,
    .configuration-field select:focus-visible,
    .modal-close:focus-visible,
    .modal-actions button:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: 3px;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }
    .modal-actions button {
      min-height: 44px;
      padding: 0 18px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--bg);
      color: var(--text);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .modal-actions .save-button {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
    }
    .configuration-status {
      min-height: 1.25em;
      margin: 14px 0 0;
      color: var(--muted);
      font-size: .85rem;
    }

    @media (max-width: 480px) {
      .topbar { min-height: 68px; }
      .theme-button { width: 40px; height: 40px; border-radius: 12px; }
      .main { padding-top: 64px; }
      .app-title { margin-bottom: 32px; }
      .dashboard-card { border-radius: 20px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition-duration: .01ms !important;
        animation-duration: .01ms !important;
      }
    }
  </style>
</head>

<body>
  <header class="topbar">
    <button
      id="configurationButton"
      class="theme-button configuration-button"
      type="button"
      aria-label="App configuration"
      title="App configuration"
    ><span aria-hidden="true">⚙</span></button>
    <h2 class="topbar-title">AppBuilder</h2>
    <button
      class="theme-button"
      id="themeButton"
      type="button"
      aria-label="Switch to dark mode"
      title="Switch theme"
    ><span id="themeIcon" aria-hidden="true">☾</span></button>
  </header>

  <main class="main">
    <section class="app-title" aria-labelledby="page-title">
      <h1 id="page-title">AppBuilder</h1>
    </section>

    <section class="dashboard-card" aria-label="Environment selection">
      <label class="field-label" for="environment-select">Select Environment</label>
      <select class="environment-select" id="environment-select" name="environment">
        <option value="">Choose an environment</option>
        ${environments.map((item) => `
        <option value="${escapeHtml(item.environment)}">${escapeHtml(item.environment)}</option>
        `).join("")}
      </select>
    </section>

    <section class="dashboard-card" aria-label="Category selection">
      <label class="field-label" for="category-select">Select Category</label>
      <select class="environment-select" id="category-select" name="category">
        <option value="">Choose a category</option>
        ${categories.map((item) => `
        <option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>
        `).join("")}
      </select>
    </section>

    <section class="dashboard-card" aria-label="Item selection">
      <label class="field-label" for="item-select">Select Item</label>
      <select class="environment-select" id="item-select" name="item" disabled>
        <option value="">Choose a category first</option>
      </select>
    </section>

    <section class="dashboard-card table-ui" aria-label="Table UI">
      <h2 class="field-label">Table UI</h2>
      <p class="table-ui-description" id="table-ui-description">
        Select a category and item to view its stored fields.
      </p>
      <div id="table-ui-content" class="table-ui-empty" role="status">
        No item selected.
      </div>
    </section>
  </main>

  <div class="modal-backdrop" id="configurationBackdrop" hidden>
    <section class="configuration-modal" id="configurationModal"
      role="dialog" aria-modal="true" aria-labelledby="configurationTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="configurationTitle">App Configuration</h2>
        <button class="modal-close" id="configurationClose" type="button"
          aria-label="Close configuration">×</button>
      </div>
      <form id="configurationForm">
        <div class="configuration-fields">
          <div class="configuration-field">
            <label for="configAppName">App Name</label>
            <input id="configAppName" name="appName" type="text"
              maxlength="80" required value="AppBuilder">
          </div>
          <div class="configuration-field">
            <label for="configAppType">App Type</label>
            <select id="configAppType" name="appType" required>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="game">Game</option>
            </select>
          </div>
          <div class="configuration-field">
            <label for="configFramework">Framework</label>
            <select id="configFramework" name="framework" required></select>
          </div>
          <div class="configuration-field">
            <label for="configColorScheme">Color Scheme</label>
            <select id="configColorScheme" name="colorScheme" required>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="configuration-field">
            <label for="configPrimaryColor">Primary Color</label>
            <input id="configPrimaryColor" name="primaryColor"
              type="color" value="#5b5bd6">
          </div>
          <div class="configuration-field">
            <label for="configAppVersion">App Version</label>
            <input id="configAppVersion" name="appVersion" type="text"
              maxlength="30" pattern="[A-Za-z0-9][A-Za-z0-9.+-]*"
              required value="1.0.0">
          </div>
        </div>
        <p class="configuration-status" id="configurationStatus"
          role="status" aria-live="polite"></p>
        <div class="modal-actions">
          <button id="configurationCancel" type="button">Cancel</button>
          <button class="save-button" type="submit">Save Configuration</button>
        </div>
      </form>
    </section>
  </div>

  <script>
    (() => {
      const openButton = document.getElementById("configurationButton");
      const backdrop = document.getElementById("configurationBackdrop");
      const closeButton = document.getElementById("configurationClose");
      const cancelButton = document.getElementById("configurationCancel");
      const form = document.getElementById("configurationForm");
      const status = document.getElementById("configurationStatus");
      const root = document.documentElement;

      const fields = {
        appName: document.getElementById("configAppName"),
        appType: document.getElementById("configAppType"),
        framework: document.getElementById("configFramework"),
        colorScheme: document.getElementById("configColorScheme"),
        primaryColor: document.getElementById("configPrimaryColor"),
        appVersion: document.getElementById("configAppVersion")
      };

      const frameworkOptions = {
        web: [["nextjs", "Next.js"], ["react", "React"],
          ["html-css-js", "HTML / CSS / JavaScript"]],
        mobile: [["expo", "Expo"], ["react-native", "React Native"]],
        desktop: [["electron", "Electron"]],
        game: [["babylonjs", "Babylon.js"],
          ["html-css-js", "HTML / CSS / JavaScript"]]
      };

      function updateFrameworkOptions(preferred) {
        const options = frameworkOptions[fields.appType.value] || [];
        fields.framework.replaceChildren();
        for (const [value, label] of options) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = label;
          fields.framework.append(option);
        }
        if (options.some(([value]) => value === preferred)) {
          fields.framework.value = preferred;
        }
      }

      function readConfiguration() {
        try {
          const value = JSON.parse(
            localStorage.getItem("appbuilder-configuration") || "{}"
          );
          return value && typeof value === "object" && !Array.isArray(value)
            ? value : {};
        } catch {
          return {};
        }
      }

      function fillForm(config) {
        fields.appName.value = config.appName || "AppBuilder";
        fields.appType.value = frameworkOptions[config.appType]
          ? config.appType : "web";
        updateFrameworkOptions(config.framework);
        fields.colorScheme.value =
          ["light", "dark", "custom"].includes(config.colorScheme)
            ? config.colorScheme : "light";
        fields.primaryColor.value =
          /^#[0-9a-f]{6}$/i.test(config.primaryColor || "")
            ? config.primaryColor : "#5b5bd6";
        fields.appVersion.value = config.appVersion || "1.0.0";
      }

      function applyConfiguration(config) {
        document.title = config.appName + " — Dashboard";
        document.getElementById("page-title").textContent = config.appName;

        if (config.colorScheme === "light" || config.colorScheme === "dark") {
          root.dataset.theme = config.colorScheme;
        }

        root.style.setProperty("--accent", config.primaryColor);
        root.style.setProperty("--accent-hover", config.primaryColor);
        root.style.setProperty("--accent-soft",
          root.dataset.theme === "dark" ? "#292947" : "#eeeeff");

        const dark = root.dataset.theme === "dark";
        const themeButton = document.getElementById("themeButton");
        document.getElementById("themeIcon").textContent = dark ? "☀" : "☾";
        themeButton.setAttribute("aria-label",
          dark ? "Switch to light mode" : "Switch to dark mode");
        themeButton.setAttribute("title",
          dark ? "Switch to light mode" : "Switch to dark mode");
        document.getElementById("themeColor").setAttribute(
          "content", dark ? "#10121b" : "#f5f7fc");
      }

      function openModal() {
        fillForm(readConfiguration());
        status.textContent = "";
        backdrop.hidden = false;
        document.body.style.overflow = "hidden";
        fields.appName.focus();
      }

      function closeModal() {
        backdrop.hidden = true;
        document.body.style.overflow = "";
        openButton.focus();
      }

      openButton.addEventListener("click", openModal);
      closeButton.addEventListener("click", closeModal);
      cancelButton.addEventListener("click", closeModal);
      backdrop.addEventListener("click", event => {
        if (event.target === backdrop) closeModal();
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !backdrop.hidden) closeModal();
        if (event.key === "Tab" && !backdrop.hidden) {
          const focusable = [...backdrop.querySelectorAll(
            'button, input, select, [href], [tabindex]:not([tabindex="-1"])'
          )].filter(el => !el.disabled);
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });

      fields.appType.addEventListener("change", () => {
        updateFrameworkOptions();
      });

      form.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const config = {
          appName: fields.appName.value.trim(),
          appType: fields.appType.value,
          framework: fields.framework.value,
          colorScheme: fields.colorScheme.value,
          primaryColor: fields.primaryColor.value,
          appVersion: fields.appVersion.value.trim()
        };

        if (!config.appName || !config.appVersion) {
          status.textContent = "App name and version are required.";
          return;
        }

        try {
          localStorage.setItem("appbuilder-configuration", JSON.stringify(config));
        } catch {
          status.textContent = "Could not save configuration in this browser.";
          return;
        }

        applyConfiguration(config);
        closeModal();
      });

      const saved = readConfiguration();
      fillForm(saved);
      applyConfiguration({
        appName: saved.appName || "AppBuilder",
        colorScheme: saved.colorScheme || "light",
        primaryColor: /^#[0-9a-f]{6}$/i.test(saved.primaryColor || "")
          ? saved.primaryColor : "#5b5bd6"
      });
    })();

    (() => {
      const categorySelect = document.getElementById("category-select");
      const itemSelect = document.getElementById("item-select");
      const tableContent = document.getElementById("table-ui-content");
      const tableDescription = document.getElementById("table-ui-description");
      let currentItems = [];

      function showEmpty(message) {
        tableContent.replaceChildren();
        tableContent.className = "table-ui-empty";
        tableContent.textContent = message;
        tableDescription.textContent =
          "Select a category and item to view its stored fields.";
      }

      function renderSelectedItem() {
        const selectedItem = currentItems.find(
          (item) => String(item.id) === itemSelect.value
        );

        if (!selectedItem) {
          showEmpty("No item selected.");
          return;
        }

        tableContent.replaceChildren();
        tableContent.className = "table-ui-scroll";

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        for (const label of ["Field", "Value"]) {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = label;
          headerRow.append(th);
        }

        thead.append(headerRow);
        table.append(thead);

        const tbody = document.createElement("tbody");
        for (const [key, value] of Object.entries(selectedItem)) {
          const row = document.createElement("tr");
          const fieldCell = document.createElement("td");
          const valueCell = document.createElement("td");

          fieldCell.textContent = key;
          valueCell.textContent =
            value === null || value === undefined
              ? ""
              : typeof value === "object"
                ? JSON.stringify(value)
                : String(value);

          row.append(fieldCell, valueCell);
          tbody.append(row);
        }

        table.append(tbody);
        tableContent.append(table);
        tableDescription.textContent =
          "Stored fields for " + String(selectedItem.name ?? "selected item") + ".";
      }

      categorySelect.addEventListener("change", async () => {
        itemSelect.replaceChildren();
        itemSelect.disabled = true;
        currentItems = [];
        showEmpty("Choose an item to display its fields.");

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = categorySelect.value
          ? "Loading items..."
          : "Choose a category first";
        itemSelect.append(placeholder);

        if (!categorySelect.value) return;

        try {
          const response = await fetch(
            "/api/items?categoryId=" + encodeURIComponent(categorySelect.value)
          );
          if (!response.ok) throw new Error("Unable to load items");

          currentItems = await response.json();
          if (!Array.isArray(currentItems)) {
            throw new Error("Invalid items response");
          }

          itemSelect.replaceChildren();
          const option = document.createElement("option");
          option.value = "";
          option.textContent = currentItems.length
            ? "Choose an item"
            : "No items available";
          itemSelect.append(option);

          for (const item of currentItems) {
            const itemOption = document.createElement("option");
            itemOption.value = item.id;
            itemOption.textContent = item.name ?? "Item " + item.id;
            itemSelect.append(itemOption);
          }

          itemSelect.disabled = currentItems.length === 0;
          showEmpty(
            currentItems.length
              ? "Select an item to display its fields."
              : "No items exist in this category yet."
          );
        } catch {
          currentItems = [];
          itemSelect.replaceChildren();
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "Failed to load items";
          itemSelect.append(option);
          showEmpty("Could not load items. Please try again.");
        }
      });

      itemSelect.addEventListener("change", renderSelectedItem);
    })();

    (() => {
      const root = document.documentElement;
      const button = document.getElementById("themeButton");
      const icon = document.getElementById("themeIcon");
      const themeColor = document.getElementById("themeColor");

      function updateThemeControls() {
        const dark = root.dataset.theme === "dark";
        icon.textContent = dark ? "☀" : "☾";
        button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        button.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
        themeColor.setAttribute("content", dark ? "#10121b" : "#f5f7fc");
      }

      function setTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem("appbuilder-theme", theme);
        updateThemeControls();
      }

      button.addEventListener("click", () => {
        setTheme(root.dataset.theme === "dark" ? "light" : "dark");
      });

      updateThemeControls();
    })();
  </script>
</body>
</html>`;
}
