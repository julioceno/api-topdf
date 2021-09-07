import { Connection, createConnection } from "typeorm";
const dbConfig = require("../config/database")

export default async (): Promise<Connection> => {
    return createConnection(
        Object.assign(dbConfig, {
            type: process.env.NODE_ENV === "test"
            ? "sqlite"
            : "mysql",
            
            database: process.env.NODE_ENV === "test"
            ? "./src/database/database.test.sqlite"
            : dbConfig.database,
        })
    );
};