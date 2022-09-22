const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordJwt = require('../passwordJwt');

const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensage: "Nome, E-mail e Senha são obrigatórios" })
    }
    try {
        const newPassword = await bcrypt.hash(senha, 10);
        const newUser = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *', [nome, email, newPassword]);
        const { senha: __, ...teste } = newUser.rows[0];

        return res.status(201).json(teste);

    } catch (error) {

        return res.status(404).json({ mensage: 'Já existe usuário cadastrado com o e-mail informado.' });
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensage: "E-mail e Senha são obrigatórios" })
    }
    try {
        const user = await pool.query('select * from usuarios where email=$1', [email]);

        const { rows, rowCount } = user;
        if (rowCount < 1) {
            return res.status(404).json({ mensage: 'E-mail ou Senha estão Incorreto' });
        }

        const validatePassword = await bcrypt.compare(senha, rows[0].senha);
        if (!validatePassword) {
            return res.status(404).json({ mensage: 'E-mail ou Senha estão Incorreto' });
        }
        const token = jwt.sign({ id: rows[0].id, nome: rows[0].nome }, passwordJwt, { expiresIn: '8h' });
        const { id, nome } = rows[0];

        return res.status(200).json({ usuario: { id, nome, email }, token })

    } catch (error) {
        return res.status(404).json({ mensage: 'Usuário e/ou senha inválido(s).' });
    }
}

const userDetail = async (req, res) => {
    try {
        const { id, nome, email } = req.usuario;
        res.json({ id, nome, email })
    } catch (error) {
        return res.status(401).json({ mensage: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }
}

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensage: "Nome, E-mail e Senha são obrigatórios" })
    }
    try {
        const newPassword = await bcrypt.hash(senha, 10);
        await pool.query('update usuarios set nome = $1, email=$2, senha=$3 where id=$4', [nome, email, newPassword, req.usuario.id]);
        res.json().send

    } catch (error) {
        return res.status(404).json({ mensage: 'O e-mail informado já está sendo utilizado por outro usuário.' });
    }

}

module.exports = {
    registerUser,
    login,
    userDetail,
    updateUser
}