import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.body.userId = decoded.userId;
        next();
    });
};
export default authMiddleware;
