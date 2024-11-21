import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

// A URI indica o IP, a porta e BD a ser conectado
const uri:string = process.env.DB_URI || "";

// Salva o objeto mongoose em uma variável
const db = mongoose;

export function connect() {
  // Utiliza o método connect do Mongoose para estabelecer a conexão com
  // o MongoDB, usando a URI
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