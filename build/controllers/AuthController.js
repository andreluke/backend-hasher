import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import criptografia from "../utils/criptografia.js";
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH || "secretKeyRefresh";
const JWT_EXPIRES_IN = "1d";
const REFRESH_EXPIRES_IN = "30d";
export function generateToken(userId, email) {
    console.log(JWT_SECRET);
    return jwt.sign({ userId: userId.toString(), email: email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
export function generateRefreshToken(userId, email) {
    return jwt.sign({ userId: userId.toString(), email: email }, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });
}
class AuthController {
    async login(req, reply) {
        const { email, senha } = req.body;
        // Verifica se email e senha foram fornecidos
        if (!email || !senha) {
            reply.status(400).send({ message: "E-mail e senha são obrigatórios" });
            return;
        }
        try {
            // Busca o usuário pelo email
            const usuario = await Usuario.findOne({ email, removidoEm: null }).select("+senha");
            if (!usuario) {
                reply.status(401).send({ message: "Usuário não encontrado" });
                return;
            }
            // Verifica se a senha está correta
            const hash = usuario.senha ?? "";
            const senhaCorreta = await criptografia.verificarSenha(senha, hash);
            if (!senhaCorreta) {
                reply.status(401).send({ message: "Credenciais inválidas" });
                return;
            }
            const token = generateToken(usuario._id, usuario.email);
            const refreshToken = generateRefreshToken(usuario._id, usuario.email);
            // Retorna os dados do usuário sem a senha
            const { senha: _, ...userWithoutPassword } = usuario.toObject();
            reply.status(200).send({
                message: "Login realizado com sucesso",
                usuario: userWithoutPassword,
                token,
                refreshToken,
            });
        }
        catch (error) {
            reply
                .status(500)
                .send({ message: "Erro no servidor", error: error.message });
        }
    }
    async refresh(req, reply) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return reply.status(401).send({ message: "Refresh token não fornecido" });
        }
        try {
            // Verifica e decodifica o Refresh Token
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            // Gera um novo JWT
            const newToken = generateToken(decoded.userId, decoded.email);
            // Opcional: Gera um novo Refresh Token também, dependendo da sua política
            const newRefreshToken = generateRefreshToken(decoded.userId, decoded.email);
            // Retorna o novo JWT e (opcionalmente) o novo Refresh Token
            return reply.send({ token: newToken, refreshToken: newRefreshToken });
        }
        catch (err) {
            return reply
                .status(403)
                .send({ message: "Refresh token inválido ou expirado" });
        }
    }
}
export default new AuthController();
