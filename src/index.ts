import express from "express";
import cors from "cors"
import routes from "./routes/index.js";
import { connect } from "./database/connection.js";
import chalk from "chalk";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Página não encontrada. Verifique a URL e tente novamente." });
});

async function startServer() {
    try {
        connect();

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(chalk.blue(`Servidor rodando na porta ${PORT}`));
                console.log(chalk.blue(`Acesse a url em: http://localhost:${PORT}`))
            });
        }
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}

startServer();

export default app;