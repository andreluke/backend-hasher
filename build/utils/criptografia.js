import bcrypt from 'bcrypt';
class CriptografiaService {
    saltRounds;
    constructor() {
        this.saltRounds = 7;
    }
    // Método para criptografar a senha
    async criptografarSenha(senha) {
        return await bcrypt.hash(senha, this.saltRounds);
    }
    // Método para verificar a senha
    async verificarSenha(senha, hash) {
        return await bcrypt.compare(senha, hash);
    }
}
export default new CriptografiaService();
