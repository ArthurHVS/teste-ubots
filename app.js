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
    // Raíz da UI.
});

//Rota da lista, feita...
const rotaLista = require('./api/lista.js');
app.use('/lista', rotaLista);

//Rota da maior compra, feita...
const rotaMaior = require('./api/maior.js');
app.use('/maior', rotaMaior);

//Rota do cliente mais fiel, feita...
const rotaFiel = require('./api/fiel.js');
app.use('/fiel', rotaFiel);

//Rota da recomendação, WIP...
const rotaRecomenda = require('./api/recomenda.js');
app.use('/recomenda', rotaRecomenda);

module.exports = app