const pool = require('../connection');

const listCategory = async (req, res) => {
    const list = await pool.query('select * from categorias');
    res.json(list.rows);
}


module.exports = {
    listCategory
}