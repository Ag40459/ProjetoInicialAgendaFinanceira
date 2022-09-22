require('dotenv').config();
const express = require('express');
const app = express();
const route = require('./router/route');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(route);


app.listen(3000, () => { console.log(process.env.AGENOR); });