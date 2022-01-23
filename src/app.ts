import "reflect-metadata";

import express from "express";
import * as dotenv from 'dotenv';
import morgan from "morgan";

import router from "./routes";
import createConnection from "./database"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});


createConnection().then( () => console.log("📜️ Database connection is ready!"))
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(router);

export { app };