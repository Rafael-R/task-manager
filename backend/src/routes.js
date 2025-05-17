const Handlers = require("./handlers");
const RequestValidators = require("./validations/request");
const ResponseValidators = require("./validations/response");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Task Manager API";
    },
  },
  {
    method: "POST",
    path: "/todos",
    handler: Handlers.addTask,
    options: {
      validate: {
        payload: RequestValidators.addTaskSchema,
      },
      response: {
        schema: ResponseValidators.taskSchema,
        failAction: "log",
      },
      tags: ["api"],
      description: "Add an item to the to-do list",
      notes: "A description must be provided.",
    },
  },
  {
    method: "GET",
    path: "/todos",
    handler: Handlers.listTasks,
    options: {
      validate: {
        query: RequestValidators.listTasksSchema,
      },
      response: {
        schema: ResponseValidators.tasksListSchema,
        failAction: "log",
      },
      tags: ["api"],
      description: "Get to-do-list",
      notes: "Returns the to-do-list filtered by state and ordered.",
    },
  },
  {
    method: "PATCH",
    path: "/todos/{id}",
    handler: Handlers.editTask,
    options: {
      validate: {
        params: RequestValidators.editTaskParamsSchema,
        payload: RequestValidators.editTaskPayloadSchema,
      },
      response: {
        schema: ResponseValidators.taskSchema,
        failAction: "log",
      },
      tags: ["api"],
      description: "Edit to-do-list item",
      notes: "TODsdfsdfsdO",
    },
  },
  {
    method: "DELETE",
    path: "/todos/{id}",
    handler: Handlers.removeTask,
    options: {
      validate: {
        params: RequestValidators.removeTaskSchema,
      },
      tags: ["api"],
      description: "Delete to-do-list item",
      notes: "fdsdfsdf",
    },
  },
];

module.exports = routes;
