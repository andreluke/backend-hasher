import Usuario from "../models/Usuario.js";
import { generateRefreshToken, generateToken } from "./AuthController.js";
import criptografia from "../utils/criptografia.js";
import { nanoid } from "nanoid";
class UsuarioController {
    async create(req, res) {
        const { nome, email, senha } = req.body;
        if (!email && !senha) {
            return res.status(401).send({ message: "Forneça o e-mail e senha" });
        }
        if (senha) {
            if (senha.length < 6) {
                return res.status(400).send({ message: "A senha precisa ter no mínimo 6 caracteres" });
            }
            else if (senha.length > 20) {
                return res.status(400).send({ message: "A senha precisa ter no máximo 20 caracteres" });
            }
        }
        try {
            const existingUser = await Usuario.findOne({ email, removidoEm: null });
            if (existingUser) {
                return res.status(400).send({
                    message: "Este e-mail já está em uso por outro usuário ativo",
                });
            }
            const removedUser = await Usuario.findOne({ email });
            if (removedUser && removedUser.removed_at !== null) {
                removedUser.removed_at = null;
                await removedUser.save();
                return res.status(201).send({ message: "Usuário reativado" });
            }
            const criadoEm = new Date();
            const senhaCriptografada = await criptografia.criptografarSenha(senha);
            const response = await Usuario.create({
                nome,
                senha: senhaCriptografada,
                email,
                created_at: criadoEm,
                links: [{
                        url: "http://example.com",
                        slug: nanoid(6)
                    }]
            });
            const token = generateToken(response._id, response.email);
            const refreshToken = generateRefreshToken(response._id, response.email);
            const { senha: _, links, ...userWithoutPassword } = response.toObject();
            return res.status(201).send({
                message: "Usuário criado com sucesso",
                usuario: userWithoutPassword,
                senha,
                token,
                refreshToken,
            });
        }
        catch (error) {
            console.error(error);
            if (error.code === 11000 || error.code === 11001) {
                return res.status(500).send({ message: "Este e-mail já está em uso" });
            }
            else if (error && error.errors["email"]) {
                return res.status(400).send({ message: error.errors["email"].message });
            }
            else if (error && error.errors["senha"]) {
                return res.status(400).send({ message: error.errors["senha"].message });
            }
            return res.status(500).send({ message: error.message });
        }
    }
    async list(_, res) {
        try {
            const usuarios = await Usuario.find({ removidoEm: null }, null, {
                sort: { email: 1 },
            });
            const usuariosReorganizados = usuarios.map((usuario) => {
                const { _id, ...rest } = usuario.toObject();
                return { _id, ...rest };
            });
            return res.status(200).send(usuariosReorganizados);
        }
        catch (error) {
            return res.status(500).send({ erro: "Erro ao listar usuários" });
        }
    }
    async getUsuario(req, res) {
        try {
            const { userId } = req.body;
            const usuario = await Usuario.findById(userId);
            if (!usuario) {
                return res.status(404).send({ erro: "Usuário não encontrado" });
            }
            const { _id, ...rest } = usuario.toObject();
            return res.status(200).send({ _id, ...rest });
        }
        catch (error) {
            return res.status(500).send({ erro: "Erro ao buscar informações do usuário" });
        }
    }
    async update(req, res) {
        const { userId, nome, email, senha } = req.body;
        try {
            const usuario = await Usuario.findOne({ _id: userId, removidoEm: null });
            if (!usuario) {
                return res.status(404).send({ message: "Usuário não encontrado" });
            }
            usuario.nome = nome || usuario.nome;
            usuario.email = email || usuario.email;
            if (senha) {
                usuario.senha = await criptografia.criptografarSenha(senha);
            }
            await usuario.save();
            return res.status(200).send({ message: "Usuário atualizado com sucesso", usuario });
        }
        catch (error) {
            console.log(error);
            if (error.code === 11000 || error.code === 11001) {
                return res.status(500).send({ message: "Este e-mail já está em uso" });
            }
            return res.status(500).send({ message: "Erro ao atualizar usuário", error });
        }
    }
    async delete(req, res) {
        try {
            const { userId } = req.body;
            const usuario = await Usuario.findOne({ _id: userId, removidoEm: null });
            if (!usuario) {
                return res.status(404).send({ message: "Usuário não encontrado" });
            }
            usuario.removed_at = new Date();
            await usuario.save();
            return res.status(200).send({ message: "Usuário removido com sucesso" });
        }
        catch (error) {
            return res.status(500).send({ message: "Erro ao remover usuário", error });
        }
    }
}
export default new UsuarioController();
