const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
require("dotenv").config();
app.use(cors());
app.use(express.json());

// testing server here
app.get('/', (req, res) => {
    res.send('Toy Galaxy is Running in server')
});

// app listening here
app.listen(port, () => {
    console.log(`Toy Galaxy is running on port: ${port}`);
})