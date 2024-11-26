import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyAutoload from "@fastify/autoload";
import path from "path";
import { connect } from "./database/connection.js";
import chalk from "chalk";
import log from "consola";
import { fileURLToPath } from "url";
export const serverInfo = {
    port: Number(process.env.PORT || 3000),
    baseURL: process.env.SERVER_BASE_URL || "http://localhost",
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = fastify();
// Usando o plugin de CORS
app.register(fastifyCors, {
    origin: "*",
});
app.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"), // usa o __dirname para resolver o caminho
    options: { prefix: "/api" },
});
app.addHook("onRoute", ({ method, path }) => {
    if (method === "HEAD" || method === "OPTIONS")
        return;
    log.success(`${chalk.yellow(method)} ${chalk.blue(path)}`);
});
// Rota raiz
app.get("/", async (request, reply) => {
    app.log.info("Requisição recebida na rota raiz");
    return "Servidor está funcionando!";
});
// Rota 404 (não encontrada)
app.setNotFoundHandler((request, reply) => {
    reply
        .status(404)
        .send({
        message: "Página não encontrada. Verifique a URL e tente novamente.",
    });
});
// Função para iniciar o servidor
async function startServer() {
    try {
        await connect();
        if (process.env.NODE_ENV !== "test") {
            app.listen({ port: serverInfo.port, host: "0.0.0.0" });
            console.log(chalk.blue(`${chalk.underline("Servidor")} rodando na porta ${serverInfo.port}`));
            //   console.log(
            //     chalk.bgYellow(chalk.bold(chalk.red("Seja bem-vindo ao hasher!")))
            //   );
            if (process.env.NODE_ENV === "development") {
                console.log(chalk.cyanBright(`Acesse a URL em: ${serverInfo.baseURL}:${serverInfo.port}/api/`));
            }
        }
    }
    catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}
startServer();
export default app;
