import { FastifyInstance, RouteShorthandOptions  } from "fastify";
import { DefineRoutesHandler } from "../settings/types.js";

export function defineRoutes(handler: DefineRoutesHandler){
    return function(app:FastifyInstance, _:{}, done:Function){
        handler(app)
        done();
    }
}