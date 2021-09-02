
module.exports = { 
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_USER,
  password: "julio123",
  database: "to_pdf",
  entities: [
     "src/app/entity/*.ts"
  ],
  migrations: [
     "src/database/migrations/*.ts"
  ],
  cli: {
    migrationsDir: "src/database/migrations"
  }
};

/* const config = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "julio",
  password: "julio123",
  database: "to_pdf",
  entities: [
     "src/app/entity/*.ts"
  ],
  migrations: [
     "src/database/migrations/*.ts"
  ],
  cli: {
    migrationsDir: "src/database/migrations"
  }
}

export { config } */