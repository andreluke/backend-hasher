import mongoose from "mongoose";
import chalk from "chalk";

const uri:string = process.env.DB_URI || "";

const db = mongoose;

export function connect() {
  db.connect(uri)
    .then(() => console.log(chalk.green("Conectado ao MongoDB")))
    .catch((e) => {
      console.error(chalk.red("Erro ao conectar ao MongoDB:"), e.message);
    });

  process.on("SIGINT", async () => {
    try {
      console.log(chalk.yellow("Conexão com o MongoDB fechada"));
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Erro ao fechar a conexão com o MongoDB:"), error);
      process.exit(1);
    }
  });
}

export async function disconnect() {
  console.log("Conexão com o MongoDB encerrada");
  await db.disconnect();
}