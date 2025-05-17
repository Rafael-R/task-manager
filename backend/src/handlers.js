const db = require("./database/db-config");

async function addTask(request, h) {
  const description = request.payload.description;

  try {
    const item = await db.add(description);
    return h.response(item).code(201);
  } catch (error) {
    console.error("Error creating task: ", error);
    return h.response({ error: "Error creating task" }).code(500);
  }
}

async function listTasks(request, h) {
  const filter = request.query.filter;
  const orderBy = request.query.orderBy.toLowerCase();

  try {
    const items = await db.list(filter, orderBy);
    return h.response(items).code(201);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return h.response({ error: "Error fetching tasks" }).code(500);
  }
}

async function editTask(request, h) {
  const id = request.params.id;
  const state = request.payload.state;
  const description = request.payload.description;

  try {
    const toUpdate = await db.findById(id);
    // verify if the referenced item (id) exists
    if (!toUpdate) {
      return h
        .response({ error: `Can't find task with given ID (${id})` })
        .code(404);
    }
    // verify if the task desciption can be changed
    if (toUpdate.state === "COMPLETE" && description !== undefined) {
      return h
        .response({ error: "Can't edit a task that is completed" })
        .code(400);
    }
    // TODO: check verifications
    const updateFields = {};
    if (state !== undefined) {
      updateFields.state = state;
      if (state === "COMPLETE" && toUpdate.completedAt === null) {
        updateFields.completed_at = new Date().toISOString();
      } else if (state === "INCOMPLETE") {
        updateFields.completed_at = null;
      }
    }
    if (description !== undefined) {
      updateFields.description = description;
    }

    const updatedItem = await db.edit(id, updateFields);
    return h.response(updatedItem).code(200);
  } catch (error) {
    console.error(`Error editing task with given ID (${id}): `, error);
    return h
      .response({ error: `Error editing task with given ID (${id})` })
      .code(500);
  }
}

async function removeTask(request, h) {
  const id = request.params.id;

  try {
    const toUpdate = await db.findById(id);

    // verify if the referenced item (id) exists
    if (!toUpdate) {
      return h
        .response({ error: `Can't find task with given ID (${id})` })
        .code(404);
    }

    await db.remove(id);
    return h.response().code(204);
  } catch (error) {
    console.error(`Error editing task with given ID (${id}): `, error);
    return h
      .response({ error: `Error editing task with given ID (${id})` })
      .code(500);
  }
}

module.exports = {
  addTask,
  listTasks,
  editTask,
  removeTask,
};
