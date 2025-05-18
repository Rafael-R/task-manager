module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './todos.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    },
  }
};