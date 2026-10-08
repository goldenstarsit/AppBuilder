import {
  getAll,
  getById,
  insert,
  update,
  remove
} from "./tableStorage.js";

export class DataTable {
  constructor(name) {
    this.name = name;
  }

  all() {
    return getAll(this.name);
  }

  findById(id) {
    return getById(this.name, id);
  }

  create(row) {
    return insert(this.name, row);
  }

  update(id, changes) {
    return update(this.name, id, changes);
  }

  delete(id) {
    return remove(this.name, id);
  }
}
