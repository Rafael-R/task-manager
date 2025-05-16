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
  let query = db("todos").orderBy(`${field}`, "asc");
  return state === "ALL" ? query : query.where("state", `${state}`);
}

function findId(id) {
  return db("todos").where("id", Number(id)).first();
}

function edit(id, state, description) {
  // TODO: fix query
  return db("todos").where("id", Number(id)).update();
}

function remove(id) {
  // TODO: fix query
  return db("todos").where("id", Number(id)).delete();
}
