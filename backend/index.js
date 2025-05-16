const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
const Joi = require("@hapi/joi");
const db = require("./data/db-config");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Task Manager API Documentation",
          version: Pack.version,
        },
      },
    },
  ]);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Task Manager API";
    },
  });

  server.route({
    method: "POST",
    path: "/todos",
    options: {
      // TODO: fix documentation
      description: "Add an item to the to-do list",
      notes: "A description must be provided.",
      tags: ["api"],
      validate: {
        payload: Joi.object({
          description: Joi.string(),
        }),
      },
      // TODO: validate response
    },
    handler: async (request, h) => {
      const description = request.payload.description;

      try {
        const item = await db.add(description);
        return h.response(item).code(201);
      } catch (error) {
        console.error("Error creating task: ", error);
        return h.response({ error: "Error creating task" }).code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/todos",
    options: {
      // TODO: fix documentation
      description: "Get to-do-list",
      notes: "Returns the to-do-list filtered by state and ordered.",
      tags: ["api"],
      validate: {
        query: Joi.object({
          filter: Joi.string()
            .valid("ALL", "COMPLETE", "INCOMPLETE")
            .default("ALL"),
          orderBy: Joi.string()
            .valid("DESCRIPTION", "CREATED_AT", "COMPLETED_AT")
            .default("CREATED_AT"),
        }),
      },
      // TODO: validate response
    },
    handler: async (request, h) => {
      const filter = request.query.filter;
      const orderBy = request.query.orderBy.toLowerCase();

      try {
        const items = await db.list(filter, orderBy);
        return h.response(items).code(200);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        return h.response({ error: "Error fetching tasks" }).code(500);
      }
    },
  });

  server.route({
    method: "PATCH",
    path: "/todos/{id}",
    options: {
      // TODO: fix documentation
      description: "Edit to-do-list item",
      notes: "TODO",
      tags: ["api"],
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required(),
        }),
        payload: Joi.object({
          state: Joi.string().valid("COMPLETE", "INCOMPLETE"),
          description: Joi.string(),
        }).min(1),
      },
      // TODO: validate response
    },
    handler: async (request, h) => {
      const id = request.params.id;
      const state = request.payload.state;
      const description = request.payload.description;

      try {
        const toUpdate = await db.findId(id);

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
    },
  });

  server.route({
    method: "DELETE",
    path: "/todos/{id}",
    options: {
      // TODO: fix documentation
      description: "Delete to-do-list item",
      notes: "TODO",
      tags: ["api"],
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required(),
        }),
      },
      // TODO: validate response
    },
    handler: async (request, h) => {
      const id = request.params.id;

      try {
        const toUpdate = await db.findId(id);

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
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
