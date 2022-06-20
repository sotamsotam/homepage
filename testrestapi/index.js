const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.header('Access-Control-Allow-Headers', 'content-type, access-token');
    next();
});

app.use('/boards', require('./boardapi'));
app.use('/members', require('./memberapi'));

app.listen(9000, () => {
	console.log('Listening...');
});