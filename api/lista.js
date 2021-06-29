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
            var gastosTotais = []
            clientes.forEach(cliente => {
                var gastoCliente = 0
                pedidos.forEach(pedido => {
                    if (sanitizeCPF(pedido.cliente) === sanitizeCPF(cliente.cpf)) {
                        gastoCliente += pedido.valorTotal
                    }
                })
                gastosTotais.push({
                    id: cliente.id,
                    nome: cliente.nome,
                    cpf: sanitizeCPF(cliente.cpf),
                    gastoTotal: parseFloat(gastoCliente.toFixed(2))
                })
            })
            gastosTotais.sort((a, b) => (a.gastoTotal < b.gastoTotal) ? 1 : -1)
            res.send(gastosTotais)
        })
    })
})

module.exports = router