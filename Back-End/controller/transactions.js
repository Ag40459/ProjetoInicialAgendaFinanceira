const pool = require("../connection");
const validateExistTransaction = require('../functions/validateExistTransaction');

const listTransactions = async (req, res) => {
    const { filtro } = req.query;
    try {
        const query = "select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id where t.usuario_id = $1"
        const queryFiltro = query + " and c.descricao ilike any ($2)"
        if (!filtro) {
            const list = await pool.query(query, [req.usuario.id]);
            return res.json(list.rows)
        }
        filtro.map((item) => { `%item%` })
        const { rows } = await pool.query(queryFiltro, [req.usuario.id, filtro
        ]);
        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json({ mensage: 'Erro Interno do Sistema.' });
    }

}

const detailTransactionsId = async (req, res) => {
    const { id } = req.params;
    validateExistTransaction(req, res, id);

    try {
        const detalCategory = await pool.query('select * from transacoes where id=$1', [id]);
        const categoryName = await pool.query('select * from categorias where id=$1', [detalCategory.rows[0].categoria_id]);

        const mirror = { ...detalCategory.rows[0], categoria_nome: categoryName.rows[0].descricao }

        res.json(mirror);

    } catch (error) {
        return res.status(500).json({ mensage: 'Erro interno do sistema' });
    }
}

const registerTransaction = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(404).json({ mensage: 'Todos os campos obrigatórios devem ser informados.' });
        }
        const { rowCount } = await pool.query('select from categorias where id=$1', [categoria_id]);
        if (rowCount < 1) {
            return res.status(404).json({ mensage: 'Categoria não Encontrada.' });
        };
        if (tipo == "entrada" || tipo == "saida") {
            const categoryName = await pool.query('select descricao from categorias where id=$1', [categoria_id]);

            const { rows } = await pool.query('insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id ) values ($1, $2, $3, $4, $5, $6) returning *', [descricao, valor, data, categoria_id, tipo, req.usuario.id]);

            const mirror = { ...rows[0], categoria_nome: categoryName.rows[0].descricao }

            res.json(mirror);

        } else {
            return res.status(404).json({ mensage: 'Tipo deve conter "saida" ou "entrada" ' });
        }
    } catch (error) {
        return res.status(500).json({ mensage: 'Erro interno do sistema' });
    }

}

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        validateExistTransaction(req, res, id);

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(404).json({ mensage: 'Todos os campos obrigatórios devem ser informados.' });
        };
        if (!tipo === 'entrada' && !tipo === 'saida') {
            return res.status(404).json({ mensage: 'Tipo deve conter "saida" ou "entrada" ' });
        };
        await pool.query('update transacoes set tipo=$1, descricao=$2, valor=$3, data=$4, categoria_id=$5, usuario_id=$6  where id=$7 returning *', [tipo, descricao, valor, data, categoria_id, req.usuario.id, id]);

        res.json().send

    } catch (error) {
        return res.status(500).json({ mensage: 'Erro Interno do Sistema.' });
    }

}

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        validateExistTransaction(req, res, id);
        await pool.query('delete from transacoes where id=$1', [id]);
        res.json().send;
    } catch (error) {
        return res.status(500).json({ mensage: 'Erro Interno do Sistema.' });
    }

}

const extractTransaction = async (req, res) => {

    try {
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
    } catch (error) {
        return res.status(500).json({ mensage: 'Erro Interno do Sistema.' });
    }

}

module.exports = {
    listTransactions,
    detailTransactionsId,
    registerTransaction,
    updateTransaction,
    deleteTransaction,
    extractTransaction
}