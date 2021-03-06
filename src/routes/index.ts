import multer from 'multer';
import { Router } from 'express';

import { authMiddleware } from '../app/middlewares/authMiddleware';
import { multerConfig } from '../config/multer';

import { UserController } from '../app/controllers/UserController';
import { AuthController } from '../app/controllers/AuthController';
import { PdfController } from '../app/controllers/PdfController';
import { AppController } from '../app/controllers/AppController';

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const pdfController = new PdfController();
const appController = new AppController();

router.post('/register', userController.store);
router.put('/update_user', authMiddleware, userController.update);
router.delete('/delete_user', authMiddleware, userController.delete);

router.post('/login', authController.authenticate);
router.post('/forgot_password', authController.forgotPassword);
router.put('/reset_password', authController.resetPassword);

router.post(
  '/create_pdf',
  authMiddleware,
  multer(multerConfig()).single('file'),
  pdfController.store
);

router.delete('/delete_pdf/:pdf_id', authMiddleware, pdfController.delete);

router.get('/app', authMiddleware, appController.index);

export default router;
