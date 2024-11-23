import { Router } from "express";
import controller from "../controllers/LinkController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const routes = Router();

routes.get("/", controller.list);
routes.get("/:slug", controller.getBySlug);
routes.post("/", authMiddleware, controller.create);
routes.delete("/:id", authMiddleware, controller.delete);
routes.put("/", authMiddleware, controller.update);

export default routes