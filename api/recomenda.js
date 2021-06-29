const express = require('express');
const router = express.Router();
const request = require('request');
var { sanitizeCPF } = require('./assets/sanitize');
var _ = require('lodash');

const APIS = require('./assets/consts');

router.get('/', (req, res) => {
    request(APIS[0], function (err, response, body) {
        var clientes = JSON.parse(body);
        clientes.forEach(cliente => {
            if (cliente.id == req.query.id) {
                request(APIS[1], function (err, response, body) {
                    var pedidos = JSON.parse(body);
                    var meusVinhos = [];
                    pedidos.forEach(pedido => {
                        if (sanitizeCPF(pedido.cliente) === sanitizeCPF(cliente.cpf)) {
                            pedido.itens.forEach(item => {
                                meusVinhos.push(item)
                            })
                        }
                    })
                    var unicos = _.uniqBy(meusVinhos, function (item) {
                        return JSON.stringify(_.pick(item, ['produto', 'variedade']));
                    })

                    //Critério de Recomendação, ler README.md
                    if (meusVinhos.length / unicos.length < 1.3){
                        res.send({
                            id: req.query.id,
                            recomendacao:{
                                vinho: meusVinhos[Math.floor(Math.random()*meusVinhos.length)]
                            }
                        })
                    }
                    else {
                        res.send({
                            id: req.query.id,
                            recomendacao:{
                                vinho: unicos[Math.floor(Math.random()*unicos.length)]
                            }
                        })
                    }
                })
            }
        });
    })
});

module.exports = router