const pool = require("../connection");

const validateExistTransaction = async (req, res, id) => {
    try {
        const { rows } = await pool.query('select * from transacoes where usuario_id=$1', [req.usuario.id]);

        const selectId = rows.filter((select) => {
            return select.id == id;
        });
        if (selectId.length === 0) {
            return res.status(404).json({ mensage: "Transação não encontrada." });
        };
    } catch (error) {
        return res.status(500).json({ mensage: 'Erro Interno do Sistema.' });

    }


}

module.exports = validateExistTransaction;
