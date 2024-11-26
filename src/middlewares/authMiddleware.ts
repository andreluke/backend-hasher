import jwt, { JwtPayload } from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';

// Tipo para o payload do JWT
interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

// Estender a tipagem do FastifyRequest para incluir a propriedade userId
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.headers.authorization?.replace('Bearer ', ''); // Extrai o token removendo "Bearer "

  if (!token) {
    return reply.status(401).send({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    
    // Armazenar o userId no contexto da requisição
    req.userId = decoded.userId;

    // Continuar com a requisição
  } catch (err) {
    return reply.status(403).send({ message: 'Token inválido' });
  }
};

export default authMiddleware;
