import { Router } from "express";
import link from "./link"

const routes = Router()

routes.use("/links", link);


export default routes