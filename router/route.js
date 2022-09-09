const express = require('express');
const { listCategory } = require('../controller/ category');
const { listTransactions, detailTransactionsId, registerTransaction, updateTransaction, deleteTransaction, extractTransaction } = require('../controller/transactions');
const { registerUser, login, userDetail, updateUser } = require('../controller/users');
const authenticateLogin = require('../intermediary/authenticateLogin');
const route = express()



route.post('/usuario', registerUser);
route.post('/login', login);
route.use(authenticateLogin);
route.get('/usuario', userDetail);
route.put('/usuario', updateUser);
route.get('/categoria', listCategory);
route.get('/transacao', listTransactions);
route.get('/transacao/:id', detailTransactionsId);
route.post('/transacao', registerTransaction);
route.put('/transacao/:id', updateTransaction);
route.delete('/transacao/:id', deleteTransaction)
route.get('/transacao/extrato', extractTransaction);

module.exports = route; 