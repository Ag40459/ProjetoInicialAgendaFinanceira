const pool = require("../connection");

const validateExistTransaction = async (req, res, id) => {
    const { rows } = await pool.query('select * from transacoes where usuario_id=$1', [req.usuario.id]);

    const selectId = rows.filter((select) => {
        return select.id == id;
    });
    if (selectId.length === 0) {
        return res.status(404).json({ mensagem: "Transação não encontrada." });
    };

}

module.exports = validateExistTransaction;
