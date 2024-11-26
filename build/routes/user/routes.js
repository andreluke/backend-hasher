import { defineRoutes } from "../../utils/defineRoutes.js";
import controller from "../../controllers/UserController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
export default defineRoutes((app) => {
    app.post("/", controller.create);
    app.get("/", { preHandler: authMiddleware }, controller.list);
    app.get("/me", { preHandler: authMiddleware }, controller.getUsuario);
    app.patch("/", { preHandler: authMiddleware }, controller.update);
    app.delete("/", { preHandler: authMiddleware }, controller.delete);
});
