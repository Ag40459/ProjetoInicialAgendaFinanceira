require('dotenv').config();
const express = require('express');
const app = express();
const route = require('./router/route');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(route);
const port = process.env.PORT || 3000

app.listen(port, () => { console.log(process.env.AGENOR); });