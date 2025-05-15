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
    },
    // TODO: validate payload
    handler: async (request, h) => {
      try {
        const item = await db.add(request.payload.description);
        return h.response(item).code(201);
      } catch (error) {
        console.error("Error adding item to db: ", error);
        return h.response({ error: "Error creating task" }).code(500);
      }
    },
  });

  // TODO: GET /todos

  // TODO: PATCH /todo/{id}

  // TODO: DELETE /todo/{id}

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
