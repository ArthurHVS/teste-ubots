const express = require('express');
const router = express.Router();
const request = require('request');
var { sanitizeCPF } = require('./assets/sanitize')
const APIS = require('./assets/consts')

router.get('/', (req, res) => {
    var clientes = [];
    var pedidos = [];
    request(APIS[0], function (err, response, body) {
        clientes = JSON.parse(body);
        request(APIS[1], function (err, response, body) {
            pedidos = JSON.parse(body)
            var comprasTotais = []
            clientes.forEach(cliente => {
                var comprasCliente = 0
                pedidos.forEach(pedido => {
                    if (sanitizeCPF(pedido.cliente) == sanitizeCPF(cliente.cpf)) {
                        comprasCliente++
                    }
                })
                comprasTotais.push({
                    nome: cliente.nome,
                    cpf: sanitizeCPF(cliente.cpf),
                    compras: comprasCliente
                })
            })
            comprasTotais.sort((a, b) => (a.compras < b.compras) ? 1 : -1)
            res.send(comprasTotais[0])
        })
    })
});

module.exports = router