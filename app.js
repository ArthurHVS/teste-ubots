const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.get('/', (req, res) => {
    res.redirect('/lista');
});

const rotaLista = require('./api/lista.js');
app.use('/lista', rotaLista);

const rotaMaior = require('./api/maior.js');
app.use('/maior', rotaMaior);

const rotaFiel = require('./api/fiel.js');
app.use('/fiel', rotaFiel);

const rotaRecomenda = require('./api/recomenda.js');
app.use('/recomenda', rotaRecomenda);

module.exports = app