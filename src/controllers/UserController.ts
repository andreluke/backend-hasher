import { Request, Response } from "express";
import Usuario from "../models/Usuario.js";
import { generateRefreshToken, generateToken } from "./AuthController.js";
import criptografia from "../utils/criptografia.js";
import { nanoid } from "nanoid";

class UsuarioController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { nome, email, senha } = req.body;

    if (!email && !senha) {
      return res.status(401).json({ message: "Forneça o e-mail e senha" });
    }

    if (senha) {
      if (senha.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha precisa ter no mínimo 6 caracteres" });
      } else if (senha.length > 20) {
        return res
          .status(400)
          .json({ message: "A senha precisa ter no máximo 20 caracteres" });
      }
    }

    try {
      const existingUser = await Usuario.findOne({ email, removidoEm: null });
      if (existingUser) {
        return res.status(400).json({
          message: "Este e-mail já está em uso por outro usuário ativo",
        });
      }

      const removedUser = await Usuario.findOne({ email });
      if (removedUser && removedUser.removed_at !== null) {
        removedUser.removed_at = null;
        await removedUser.save();
        return res.status(201).json({ message: "Usuario reativado" });
      }

      const criadoEm: Date = new Date();

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

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        usuario: userWithoutPassword,
        senha,
        token,
        refreshToken,
      });
    } catch (error: any) {
      console.error(error);
      if (error.code === 11000 || error.code === 11001) {
        // código 11000 e 11001 indica violação de restrição única (índice duplicado)
        return res.status(500).json({ message: "Este e-mail já está em uso" });
      } else if (error && error.errors["email"]) {
        return res.status(400).json({ message: error.errors["email"].message });
      } else if (error && error.errors["senha"]) {
        return res.status(400).json({ message: error.errors["senha"].message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  public async list(_: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.find({ removidoEm: null }, null, {
        sort: { email: 1 },
      });

      const usuariosReorganizados = usuarios.map((usuario) => {
        const { _id, ...rest } = usuario.toObject();
        return { _id, ...rest };
      });

      return res.status(200).json(usuariosReorganizados);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  }

  public async getUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      const { _id, ...rest } = usuario.toObject();
      return res.status(200).json({ _id, ...rest });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao buscar informações do usuário" });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { userId, nome, email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ _id: userId, removidoEm: null });

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      if (senha) {
        usuario.senha = await criptografia.criptografarSenha(senha);
      }

      await usuario.save();
      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso", usuario });
    } catch (error: any) {
      console.log(error);
      if (error.code === 11000 || error.code === 11001) {
        return res.status(500).json({ message: "Este e-mail já está em uso" });
      }
      return res
        .status(500)
        .json({ message: "Erro ao atualizar usuário", error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;

      const usuario = await Usuario.findOne({ _id: userId, removidoEm: null });

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      usuario.removed_at = new Date();
      await usuario.save();

      return res.status(200).json({ message: "Usuário removido com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao remover usuário", error });
            
    }
  }
}

export default new UsuarioController();
