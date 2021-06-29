const express = require('express');
const router = express.Router();
const request = require('request');
var {sanitizeCPF} = require('./assets/sanitize')
const APIS = require('./assets/consts')

router.get('/', (req, res) => {
    var pedidos = [];
    var clientes = [];
    var maiorCompra = 0;
    var maiorCliente = {}
    request(APIS[0], function (err, response, body) {
        clientes = JSON.parse(body);
        request(APIS[1], function (err, response, body) {
            pedidos = JSON.parse(body);
            pedidos.forEach(pedido => {
                if (pedido.data.slice(-4) == req.query.ano && pedido.valorTotal > maiorCompra) {
                    maiorCompra = pedido.valorTotal
                    maiorCliente = {
                        cliente: sanitizeCPF(pedido.cliente),
                        valorAnual: maiorCompra
                    }
                }
            })
            res.send(maiorCliente)
        })
    })
})

module.exports = router