
let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');

chai.use(chaiHttp);
let should = chai.should();

var { sanitizeCPF } = require('./api/assets/sanitize.js');
var API_URLS = require('./api/assets/consts.js');

describe('Testes Implementados', () => {
    describe('Sanitização', () => {
        'use strict';
        it('Testando a existência da função sanitizeCPF(cpf)', function () {
            expect(sanitizeCPF).to.be.a('function');
          });
        it('Testando a sanitização com CPF de 11 dígitos, separados corretamente.', function(){
            let correto = '123.456.789-10';
            let res = sanitizeCPF(correto);
            expect(res).to.deep.equal('123.456.789-10');
        })
        it('Testando a sanitização com CPF de mais de 11 dígitos, separados incorretamente.', function(){
            let correto = '0007.007.777-77';
            let res = sanitizeCPF(correto);
            expect(res).to.deep.equal('007.007.777-77');
        })
        it('Testando a sanitização com CPF de mais de 11 dígitos, sem separação nenhuma.', function(){
            let correto = '000800777788';
            let res = sanitizeCPF(correto);
            expect(res).to.deep.equal('008.007.777-88');
        })
    })
    describe('Respostas das APIs fornecidas', () => {
        it('Testando a existência do arquivo de constantes.', function(){
            expect(API_URLS).to.be.a('array')
        })
        it('Testando o tamanho do vetor de constantes.', function(){
            expect(API_URLS).to.have.length(2)
        })
        it('Testando a conexão com as API de cadastros fornecida.', function(){
            chai.request(API_URLS[0])
            .get('/')
            .end((err, res) => {
                if(err) throw err;
                res.should.have.status(200);
            })  
        })
        it('Testando a conexão com as API de pedidos fornecida.', function(){
            chai.request(API_URLS[1])
            .get('/')
            .end((err, res) => {
                if(err) throw err;
                res.should.have.status(200)
            })  
        })
    })
})