const Joi = require("@hapi/joi");

const addTaskSchema = Joi.object({
  description: Joi.string().required().description("Task description"),
});

const listTasksSchema = Joi.object({
  filter: Joi.string()
    .valid("ALL", "COMPLETE", "INCOMPLETE")
    .default("ALL")
    .description("State of the tasks to list"),
  orderBy: Joi.string()
    .valid("DESCRIPTION", "CREATED_AT", "COMPLETED_AT")
    .default("CREATED_AT")
    .description("Order of the tasks to list"),
});

const editTaskParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .description("ID of the task to edit"),
});

const editTaskPayloadSchema = Joi.object({
  state: Joi.string()
    .valid("COMPLETE", "INCOMPLETE")
    .description("Updated state of the task"),
  description: Joi.string().description("Updated description of the task"),
}).min(1);

const removeTaskSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .description("ID of the task to remove"),
});

module.exports = {
  addTaskSchema,
  listTasksSchema,
  editTaskParamsSchema,
  editTaskPayloadSchema,
  removeTaskSchema
};
