const express = require('express');
const { listCategory } = require('../controller/ category');
const { transactions, transactionsId, registerTransaction, updateTransaction, deleteTransaction, extractTransaction } = require('../controller/transactions');
const { registerUser, login, userDetail, updateUser } = require('../controller/users');
const authenticateLogin = require('../intermediary/authenticateLogin');
const route = express()



route.post('/usuario', registerUser);
route.post('/login', login);
route.use(authenticateLogin);
route.get('/usuario', userDetail);
route.put('/usuario', updateUser);
route.get('/categoria', listCategory);
route.get('/transacao', transactions);
route.get('/transacao/extrato', extractTransaction);
route.get('/transacao/:id', transactionsId);
route.post('/transacao', registerTransaction);
route.put('/transacao/:id', updateTransaction);
route.delete('/transacao/:id', deleteTransaction)

module.exports = route;