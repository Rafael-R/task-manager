const Joi = require("@hapi/joi");

const taskSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .description("ID of the task"),
  state: Joi.string()
    .valid("COMPLETE", "INCOMPLETE")
    .required()
    .description("State of the tasks"),
  description: Joi.string().required().description("Task description"),
  created_at: Joi.string()
    .required()
    .description("Timestamp of task creation"),
  created_at: Joi.string()
    .allow(null)
    .description("Timestamp of task completion"),
}).label("Task");

const tasksListSchema = Joi.array().items(taskSchema).label("TasksList")

module.exports = {
  taskSchema,
  tasksListSchema,
};