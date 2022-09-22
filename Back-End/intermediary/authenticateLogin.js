const pool = require('../connection');
const jwt = require('jsonwebtoken');
const passwordJwt = require('../passwordJwt');

const authenticateLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    if (token === 'undefined') {
        return res.status(404).json({ mensagem: 'Token Inválido' })
    }

    try {
        const verificaToken = await jwt.verify(token, passwordJwt);
        const { rowCount, rows } = await pool.query('select * from usuarios where id=$1', [verificaToken.id]);
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Usuário ou Senha não identificado' })
        }
        req.usuario = rows[0];
        next();
    } catch (error) {
        return res.status(500).json('Usuário e/ou senha inválido(s).')
    }
}

module.exports = authenticateLogin;