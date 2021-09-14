import "reflect-metadata";
import express from "express";
import router from "./routes";
import createConnection from "./database"
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

createConnection().then( () => console.log("📜️ Database connection is ready!"))
const app = express();

app.use(express.json());
app.use(router);

export { app };