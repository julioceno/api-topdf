require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

module.exports = { 
  type: process.env.NODE_ENV === "test"? "sqlite" : "mysql",
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.NODE_ENV === "test" ? "./src/database/database.test.sqlite" :  process.env.MYSQL_DATABASE,
  dropSchema: true,
  logging: false,
  synchroize: true,
  migrationsRun: true,
  define: {
    timestamps: true,
    underscored: true
  },
  entities: [
     "./src/app/models/*.ts"
  ],
  migrations: [
     "./src/database/migrations/*.ts"
  ],
  cli: {
    migrationsDir: "./src/database/migrations"
  }
};