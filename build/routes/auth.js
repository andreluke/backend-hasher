import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
const routes = Router();
routes.post('/login', AuthController.login);
routes.post('/refresh-token', AuthController.refresh);
export default routes;
