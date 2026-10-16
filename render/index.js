export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export function renderTable(rows, kind, selectedId = "") {
  if (!rows.length) {
    return '<tr><td colspan="3" class="empty-cell">No matching records found.</td></tr>';
  }

  return rows.map((row, index) => `
    <tr class="${String(selectedId) === String(row.id) ? "selected-row" : ""}">
      <td class="number-cell">${index + 1}</td>
      <td class="name-cell">${escapeHtml(row.name)}</td>
      <td class="actions-cell">
        <button class="row-action" type="button"
          data-kind="${kind}" data-id="${row.id}">
          Select
        </button>
      </td>
    </tr>
  `).join("");
}
