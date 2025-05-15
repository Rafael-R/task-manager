const knex = require("knex");
const config = require("../knexfile");

const db = knex(config.development);

module.exports = {
  add,
  list,
  edit,
  remove,
};

function add(description) {
  return db("todos")
    .returning(["id", "state", "description", "created_at", "completed_at"])
    .insert({ description: description });
}

function list(state, field) {
  // TODO: fix query
  return db("todos").where("state", String(state)).orderBy(`${field}`, "asc");
}

function edit(id, state, description) {
  // TODO: fix query
  return db("todos").where("id", Number(id)).update();
}

function remove(id) {
  // TODO: fix query
  return db("todos").where("id", Number(id)).delete();
}
