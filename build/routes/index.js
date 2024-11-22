import { Router } from "express";
import link from "./link.js";
const routes = Router();
routes.use("/links", link);
export default routes;
