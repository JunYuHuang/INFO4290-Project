import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
});

export default db;
