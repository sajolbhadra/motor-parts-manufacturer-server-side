const express = require('express');
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
require('dotenv').config();



app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen(port, () => {
    console.log('Server on port', port)
})