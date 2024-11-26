import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
const authMiddleware = async (req, reply) => {
    const token = req.headers.authorization?.replace('Bearer ', ''); // Extrai o token removendo "Bearer "
    if (!token) {
        return reply.status(401).send({ message: 'Token não fornecido' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Armazenar o userId no contexto da requisição
        req.userId = decoded.userId;
        // Continuar com a requisição
    }
    catch (err) {
        return reply.status(403).send({ message: 'Token inválido' });
    }
};
export default authMiddleware;
