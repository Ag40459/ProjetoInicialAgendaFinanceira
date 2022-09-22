const pool = require('../connection');

const listCategory = async (req, res) => {
    try {
        const list = await pool.query('select * from categorias');
        res.json(list.rows);

    } catch (error) {
        return res.status(500).json({ mensage: 'Erro interno do sistema' });
    }
}

module.exports = {
    listCategory
}