import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyAutoload from "@fastify/autoload";
import path from "path";
import { connect } from "./database/connection.js";
import chalk from "chalk";
import log from "consola"
import { fileURLToPath } from "url";
import {fastifySwagger} from "@fastify/swagger";
import {fastifySwaggerUi} from "@fastify/swagger-ui";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const serverInfo = {
  port: Number(process.env.PORT || 3000),
  baseURL: process.env.SERVER_BASE_URL || "http://localhost",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: FastifyInstance  = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Hasher API",
      description: "API Documentation for link hasher",
      version: "1.0.0",
    }
  },
  
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"), 
    options: { prefix: "/api" },
  });
  
app.addHook("onRoute", ({method, path}) => {
    if(method === "HEAD" || method === "OPTIONS" || path.startsWith("/docs")) return
    log.success(`${chalk.yellow(method)} ${chalk.blue(path)}`)
})


app.get("/", async (request, reply) => {
  app.log.info("Requisição recebida na rota raiz");
  return "Servidor está funcionando!";
});

app.setNotFoundHandler((request, reply) => {
  reply
    .status(404)
    .send({
      message: "Página não encontrada. Verifique a URL e tente novamente.",
    });
});

async function startServer() {
  try {
    await connect();

    if (process.env.NODE_ENV !== "test") {
      app.listen({ port: serverInfo.port, host: "0.0.0.0" });
      console.log(
        chalk.blue(
          `${chalk.underline("Servidor")} rodando na porta ${serverInfo.port}`
        )
      );
      console.log(
        chalk.bgYellow(chalk.bold(chalk.red("Seja bem-vindo ao hasher!")))
      );
      if (process.env.NODE_ENV === "development") {
        console.log(
          chalk.cyanBright(
            `Acesse a URL em: ${serverInfo.baseURL}:${serverInfo.port}/api/`
          )
        );
      }
      console.log(
        chalk.magenta(
          `Acesse a documentação em: ${serverInfo.baseURL}:${serverInfo.port}/docs/`
        )
      );
    }
  } catch (error) {
    console.error("Erro ao iniciar a aplicação:", error);
  }
}

startServer();

export default app;
