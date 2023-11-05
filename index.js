const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());











app.get('/', (req, res) => {
    res.send('Bakery is running')
});
app.listen(port, () => {
    console.log(`SL Bakery is running on port ${port}`)
});