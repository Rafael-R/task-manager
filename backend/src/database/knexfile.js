module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/todos.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    },
  }
};