const Hapi = require("@hapi/hapi");
const plugins = require('./plugins');
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
  });

  await server.register(plugins);
  server.route(routes);

  await server.start();
  console.log("Server running at:", server.info.uri);
};

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
});

init();
