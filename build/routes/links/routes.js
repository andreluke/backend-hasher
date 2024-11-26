import { defineRoutes } from '../../utils/defineRoutes.js';
import controller from '../../controllers/LinkController.js';
import authMiddleware from "../../middlewares/authMiddleware.js";
export default defineRoutes(app => {
    app.get("/", controller.list);
    app.get("/:slug", controller.getBySlug);
    app.post("/", { preHandler: authMiddleware }, controller.create);
    app.delete("/:id", { preHandler: authMiddleware }, controller.delete);
    app.put("/", { preHandler: authMiddleware }, controller.update);
});
