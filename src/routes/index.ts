import { Router } from "express";
import { AuthController } from "../app/controllers/AuthController";

const routes = Router();

const authController = new AuthController()

routes.get("/register", authController.register);

export default routes;