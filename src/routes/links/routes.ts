import { defineRoutes } from '../../utils/defineRoutes.js';
import controller from '../../controllers/LinkController.js';
import authMiddleware from "../../middlewares/authMiddleware.js";
import {createLink, deleteLink, updateLink} from "../../interfaces/ILinkController.js"

export default defineRoutes(app => {
    app.get("/", controller.list);
    app.get("/:slug", controller.getBySlug);
    app.post<createLink>("/", { preHandler: authMiddleware }, controller.create);
    app.delete<deleteLink>("/:id", { preHandler: authMiddleware }, controller.delete);
    app.put<updateLink>("/", { preHandler: authMiddleware }, controller.update);
})

