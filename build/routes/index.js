import { Router } from "express";
import link from "./link.js";
import usuario from "./usuario.js";
import auth from "./auth.js";
const routes = Router();
routes.use("/links", link);
routes.use("/user", usuario);
routes.use("/auth", auth);
export default routes;
