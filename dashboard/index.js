(async () => {
  try {
    const [{ platforms, categories, items }, { renderTable }] =
      await Promise.all([
        import("../data/index.js"),
        import("../render/index.js")
      ]);

const $ = id => document.getElementById(id);
    $("runtimeStatus").textContent = "JavaScript started; modules loaded.";
const platformSelect = $("platformSelect");
const categorySelect = $("categorySelect");
const itemSelect = $("itemSelect");
const state = { platformId:"", categoryId:"", itemId:"" };

function fill(select, records, placeholder) {
  select.replaceChildren(new Option(placeholder, ""));
  records.forEach(record => select.add(new Option(record.name, String(record.id))));
}
function getRecord(records, id) {
  return records.find(record => record.id === Number(id));
}
function matchingItems() {
  if (!state.platformId || !state.categoryId) return [];
  return items.filter(item =>
    item.platformId === Number(state.platformId) &&
    item.categoryId === Number(state.categoryId)
  );
}
function currentView() {
  if (!state.platformId) return {
    title:"Platforms", description:"All available platforms",
    kind:"platform", rows:platforms
  };
  if (!state.categoryId) return {
    title:"Categories", description:"All available categories",
    kind:"category", rows:categories
  };
  return {
    title:"Items", description:"Items for the selected platform and category",
    kind:"item", rows:matchingItems()
  };
}
function render() {
  categorySelect.disabled = !state.platformId;
  itemSelect.disabled = !(state.platformId && state.categoryId);
  fill(categorySelect, categories, "All categories");
  categorySelect.value = state.categoryId;
  fill(itemSelect, matchingItems(), "All matching items");
  itemSelect.value = state.itemId;

  $("platformSummary").textContent = state.platformId
    ? getRecord(platforms, state.platformId)?.name || "Platform selected"
    : `${platforms.length} available platforms`;
  $("categorySummary").textContent = !state.platformId
    ? "Select a platform first"
    : state.categoryId
      ? getRecord(categories, state.categoryId)?.name || "Category selected"
      : `${categories.length} available categories`;
  $("itemSummary").textContent = !state.platformId || !state.categoryId
    ? "Select a platform and category first"
    : state.itemId
      ? getRecord(matchingItems(), state.itemId)?.name || "Item selected"
      : `${matchingItems().length} matching items`;

  const view = currentView();
  $("tableTitle").textContent = view.title;
  $("tableDescription").textContent = view.description;
  $("rowCount").textContent = `${view.rows.length} ${view.rows.length === 1 ? "record" : "records"}`;
  $("tableBody").innerHTML = renderTable(view.rows, view.kind, state.itemId);
}

platformSelect.addEventListener("change", () => {
  state.platformId = platformSelect.value;
  state.categoryId = "";
  state.itemId = "";
  render();
});
categorySelect.addEventListener("change", () => {
  state.categoryId = categorySelect.value;
  state.itemId = "";
  render();
});
itemSelect.addEventListener("change", () => {
  state.itemId = itemSelect.value;
  render();
});
$("tableBody").addEventListener("click", event => {
  const button = event.target.closest("[data-kind][data-id]");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.kind === "platform") {
    state.platformId = id;
    state.categoryId = "";
    state.itemId = "";
    platformSelect.value = id;
  } else if (button.dataset.kind === "category" && state.platformId) {
    state.categoryId = id;
    state.itemId = "";
  } else if (button.dataset.kind === "item") {
    state.itemId = id;
  }
  render();
});

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("themeToggle").textContent = theme === "dark" ? "☀" : "☾";
  $("themeToggle").setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("appbuilder-theme", theme); } catch {}
}
let theme = "light";
try { theme = localStorage.getItem("appbuilder-theme") || "light"; } catch {}
setTheme(theme === "dark" ? "dark" : "light");
$("themeToggle").addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
fill(platformSelect, platforms, "All platforms");
render();
$("runtimeStatus").textContent = "Dashboard initialized successfully.";
  } catch (error) {
    console.error("AppBuilder dashboard startup failed:", error);
    const status = document.getElementById("runtimeStatus");
    if (status) status.textContent = "Startup error: " + (error?.message || String(error));
    const notice = document.getElementById("dataNotice");
    const body = document.getElementById("tableBody");
    if (notice) {
      notice.textContent =
        "Dashboard startup failed: " + (error?.message || String(error));
      notice.style.color = "#d92d20";
    }
    if (body) {
      body.innerHTML =
        '<tr><td colspan="3" class="empty-cell">Unable to initialize dashboard. See the message above.</td></tr>';
    }
  }
})();
