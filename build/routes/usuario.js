import { Router } from "express";
import controller from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const routes = Router();
routes.post("/", controller.create);
routes.get("/", authMiddleware, controller.list);
routes.get("/me", authMiddleware, controller.getUsuario);
routes.put("/", authMiddleware, controller.update);
routes.delete("/", authMiddleware, controller.delete);
export default routes;