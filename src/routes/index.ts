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
router.put("/update", authMiddleware, userController.update);
router.put("/delete", authMiddleware, userController.delete);

router.post("/login", authController.authenticate);
router.post("/forgot_password", authController.forgotPassword);
router.put("/reset_password", authController.resetPassword);

router.get("/app", authMiddleware, appController.index);

export default router;