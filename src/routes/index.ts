import { Router } from "express";

import { authMiddleware } from "../app/middlewares/authMiddleware";

import { UserController } from "../app/controllers/UserController";
import { AuthController } from "../app/controllers/AuthController";
import { AppController } from "../app/controllers/AppController";

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const appController = new AppController();

router.post("/register", userController.store);
router.post("/login", authController.authenticate);

router.get("/app", authMiddleware, appController.index);

export default router;