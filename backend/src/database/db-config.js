const knex = require("knex");
const config = require("./knexfile");

const db = knex(config.development);

async function add(description) {
  return db("todos")
    .returning(["id", "state", "description", "created_at", "completed_at"])
    .insert({ description: description });
}

async function list(state, field) {
  let query = db("todos").orderBy(`${field}`, "asc");
  return state === "ALL" ? query : query.where("state", `${state}`);
}

async function findById(id) {
  return db("todos").where("id", Number(id)).first();
}

async function edit(id, updateFields) {
  return db("todos")
    .returning(["id", "state", "description", "created_at", "completed_at"])
    .where("id", Number(id))
    .update(updateFields);
}

async function remove(id) {
  return db("todos").where("id", Number(id)).delete();
}

module.exports = {
  add,
  list,
  findById,
  edit,
  remove,
};