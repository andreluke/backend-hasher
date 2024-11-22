import { Router } from "express";
import controller from "../controllers/LinkController.js";
const routes = Router();
routes.get("/", controller.list);
routes.get("/:slug", controller.getBySlug);
routes.post("/", controller.create);
routes.delete("/:id", controller.delete);
routes.put("/", controller.update);
export default routes;
