export function createTable(name, columns = [], rows = []) {
  return {
    name,
    columns,
    rows
  };
}

export function addRow(table, row) {
  table.rows.push(row);
  return table;
}

export function updateRow(table, index, row) {
  if (index < 0 || index >= table.rows.length) {
    throw new Error("Invalid row index");
  }

  table.rows[index] = row;
  return table;
}

export function deleteRow(table, index) {
  if (index < 0 || index >= table.rows.length) {
    throw new Error("Invalid row index");
  }

  table.rows.splice(index, 1);
  return table;
}
