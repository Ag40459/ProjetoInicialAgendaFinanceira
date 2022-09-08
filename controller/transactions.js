const pool = require("../connection");
const validateExistTransaction = require('../functions/validateExistTransaction');

const transactions = async (req, res) => {
    const list = await pool.query('select * from transacoes where usuario_id=$1', [req.usuario.id]);
    res.json(list.rows)
    // ADICIONAR O NOME DA CATEGORIA NO RESULTADO
}

const transactionsId = async (req, res) => {
    const { id } = req.params;
    validateExistTransaction(req, res, id);

    const categoryName = await pool.query('select * from transacoes where id=$1', [id]);
    // const { rows } = await pool.query('select * from transacoes where usuario_id=$1', [id]);

    console.log(categoryName.rows);
    // ADICIONAR O NOME DA CATEGORIA NO RESULTADO

    res.json(categoryName.rows);
}

const registerTransaction = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
        }
        const { rowCount } = await pool.query('select from categorias where id=$1', [categoria_id]);
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Categoria não Encontrada.' });
        };
        if (tipo == "entrada" || tipo == "saidaa") {
            const categoryName = await pool.query('select descricao from categorias where id=$1', [categoria_id]);

            const { rows } = await pool.query('insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id ) values ($1, $2, $3, $4, $5, $6) returning *', [descricao, valor, data, categoria_id, tipo, req.usuario.id]);

            // ADICIONAR O NOME DA CATEGORIA NO RESULTADO

            return res.json(rows[0])
        } else {
            return res.status(404).json({ mensagem: 'Tipo deve conter "saida" ou "entrada" ' });
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do sistema' });
    }

}

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        validateExistTransaction(req, res, id);

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
        };
        if (!tipo === 'entrada' && !tipo === 'saida') {
            return res.status(404).json({ mensagem: 'Tipo deve conter "saida" ou "entrada" ' });
        };
        await pool.query('update transacoes set tipo=$1, descricao=$2, valor=$3, data=$4, categoria_id=$5, usuario_id=$6  where id=$7 returning *', [tipo, descricao, valor, data, categoria_id, req.usuario.id, id]);

        res.json().send

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno do Sistema.' });
    }

}

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    validateExistTransaction(req, res, id);

    await pool.query('delete from transacoes where id=$1', [id]);

    res.json().send;

}

const extractTransaction = async (req, res) => {

    const { rows } = await pool.query('select * from transacoes where usuario_id=$1', [req.usuario.id]);

    const entrada = rows.filter((select) => {
        return select.tipo == "entrada";
    });
    const saida = rows.filter((select) => {
        return select.tipo == "saida";
    })
    let totalSaida = 0;
    let totalEntrada = 0;
    entrada.map((select) => {
        select.valor
        totalEntrada = totalEntrada + select.valor;
    });
    saida.map((select) => {
        select.valor
        totalSaida = totalSaida + select.valor;
    });
    res.json({ totalEntrada, totalSaida });
}

module.exports = {
    transactions,
    transactionsId,
    registerTransaction,
    updateTransaction,
    deleteTransaction,
    extractTransaction
}