import { defineRoutes } from "../../utils/defineRoutes.js";
import controller from "../../controllers/UserController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../../interfaces/IUserController.js";

export default defineRoutes((app) => {
  app.post<createUser>("/", controller.create);
  app.get("/", { preHandler: authMiddleware }, controller.list);
  app.get<getUser>(
    "/me",
    { preHandler: authMiddleware },
    controller.getUsuario
  );
  app.patch<updateUser>("/", { preHandler: authMiddleware }, controller.update);
  app.delete<deleteUser>(
    "/",
    { preHandler: authMiddleware },
    controller.delete
  );
});
