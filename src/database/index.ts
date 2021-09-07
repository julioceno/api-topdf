import { Connection, createConnection } from "typeorm";
const dbConfig = require("../config/database")

export default async (): Promise<Connection> => {
    return createConnection(
        dbConfig

    );
};