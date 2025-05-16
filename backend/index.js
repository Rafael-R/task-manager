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

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
