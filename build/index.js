import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { connect } from "./database/connection.js";
import chalk from "chalk";
export const serverInfo = {
    port: Number(process.env.PORT || 3000),
    baseURL: process.env.SERVER_BASE_URL || "http://localhost",
};
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use("/api", routes);
app.use((req, res, next) => {
    res.status(404).json({ message: "Página não encontrada. Verifique a URL e tente novamente." });
});
app.get("/", (req, res) => {
    console.log("Requisição recebida na rota raiz");
    res.send("Servidor está funcionando!");
});
async function startServer() {
    try {
        connect();
        if (process.env.NODE_ENV !== 'test') {
            app.listen(serverInfo.port, "0.0.0.0", () => {
                console.log(chalk.blue(`${chalk.underline("Servidor")} rodando na porta ${serverInfo.port}`));
                console.log(chalk.bgYellow(chalk.bold(chalk.red("Seja bem vindo ao hasher!"))));
                if (process.env.NODE_ENV === "development") {
                    console.log(chalk.blue(`Acesse a URL em: ${serverInfo.baseURL}:${serverInfo.port}/api/`));
                }
            });
        }
    }
    catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}
startServer();
export default app;
