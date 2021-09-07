require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

import "reflect-metadata";
import express from "express";
import router from "./routes";
import createConnection from "./database"

createConnection()
const app = express();

app.use(express.json());
app.use(router);

export { app };