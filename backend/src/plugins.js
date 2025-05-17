const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("../package");

const Swagger = {
  plugin: HapiSwagger,
  options: {
    info: {
      title: "Test API Documentation",
      version: Pack.version,
    },
    grouping: "tags",
  },
};

module.exports = [Inert, Vision, Swagger];
