
Arthur Henrique Verdadeiro
## Sumário
- [Objetivos](#objetivos)
- [Dependências da Aplicação](#dependencias)
- [Endpoints da API](#endpoints)
	- [Lista ordenada de todos os clientes](#lista)
	- [Lista dos clientes mais fiéis](#fieis)
	- [Cliente com maior compra anual](#maior-anual)
	- [Recomendação Personalizada](#recomenda)
- Outros Recursos
	- [Sanitização dos CPF's](#sanitizer)
	- [Critério de Recomendação](#criterio)
	- [Constantes](#constantes)
	- [Deploy](#deploy)
	- [Testes](#testes)

## Objetivos
<a name="objetivos"></a>
- A partir das respostas de API's fornecidas pelo Velasquinho, implementar uma API REST que:
    - Liste os clientes da loja de vinhos do Velasquez, ordenando-os pela quantia total gasta na loja.
    - Mostre o cliente com a maior compra em um ano específico.
    - Liste os clientes "mais fiéis", usando como critério a quantidade total de compras.
    - Recomende um vinho para um cliente específico, segundo um critério definido.

## Dependências da Aplicação
<a name="dependencias"></a>
- Para instalar as dependências, com o repositório clonado, na linha de comando digite `npm install`
- Lista de dependências:
	-[Node.js](https://nodejs.dev/ "Node.js"), v. ^14.15.0,
	-[Express JS](https://www.npmjs.com/package/express "Express JS"), v. ^4.17.1,
	-[Helmet](https://www.npmjs.com/package/helmet "Helmet"), v. ^4.6.0,
	-[Lodash](https://www.npmjs.com/package/lodash "Lodash"), v. ^4.17.21,
	-[Request](https://www.npmjs.com/package/request "Request"), v. ^2.88.2
	-[ChaiJS](https://www.npmjs.com/package/chai), v^4.3.4
	-[Chai-HTTP](https://www.npmjs.com/package/chai-http), v^4.3.0
	-[Mocha](https://www.npmjs.com/package/chai), v^9.0.1
- O conjunto Node/Express corresponde às dependências básicas da aplicação.
- A biblioteca Helmet facilita a construção de cabeçalhos http mais seguros.
- A biblioteca Lodash implementa diversas funções de busca e ordenação, sendo usada na recomendação de vinhos.
- A biblioteca Request implementa uma maneira simples de realizar requisições http em Node.js.

## EndPoints da API
<a name="endpoints"></a>
#### Endpoint raíz `GET /`
- Redireciona para o endpoint `/lista`

#### Lista ordenada de todos os clientes `GET /lista`

- Gera uma resposta em JSON, no formato:
        [{
			id: 1
        	nome: "Jhonatan",
        	cpf: "000.000.000-08",
        	gastoTotal: 3190.7
        },
		id: 2
        	nome: "Raquel",
        	cpf: "000.000.000-05",
        	gastoTotal: 2199.6
        },{...}]

- Soma comparando o CPF registrado em cada compra, [sanitizado](#sanitizer)
- O vetor da resposta é ordenado do maior "gastoTotal" para o menor.

#### Mostra o cliente com maior compra anual `GET /maior?ano=2016`

- Gera uma resposta em JSON, no formato:
        {
        	cpf: "000.000.000-06",
        	valorAnual: 655.9
        }
- O vetor da resposta contém o CPF cadastrado em cada compra, [sanitizado](#sanitizer)
- O ano consultado é definido pela query `?ano=x`

#### Lista dos clientes mais fieis `GET /fieis?limite=2`

- Gera uma resposta em JSON, no formato:
        [
			{
				"nome":"Rafael",
				"cpf":"000.000.000-10",
				"compras":3
			},
			{
			"nome":"Matheus",
			"cpf":"000.000.000-09",
			"compras":3
			},
			{
			"nome":"Vinicius",
			"cpf":"000.000.000-01",
			"compras":2
			}
		]
- O cpf contido nos elementos do vetor-resposta são provenientes da API de cadastro, porém, também foi [sanitizado](#sanitizer).
- O vetor da resposta tem o tamanho definido pela query `?limite=x`, e é ordenado pelo campo "compras"

#### Recomenda um vinho para um cliente específico `GET /recomenda?id=1`

- Gera uma resposta em JSON, no formato:
		{
			"id":"6",
			"recomendacao" : {
				"vinho": {
					"produto":"Casa Silva Reserva",
					"variedade":"Sauvignon Blanc",
					"pais":"Chile",
					"categoria":"Branco",
					"safra":"2015",
					"preco":79
					}
				}
			}
        }
- Gera uma recomendação personalizada para cada id, com base no histórico de compras do cliente, a partir da query `?id=x`.
- O critério de recomendação está descrito em sua [seção](#criterio) na documentação.

### Outros recursos
#### Sanitização
<a name="sanitizer"></a> 
- A resposta do endpoint referente ao histórico de compras contém valores de CPF com 12 dígitos, e com os últimos 2 dígitos separados por ponto (formato inválido), enquanto a API de cadastros responde com CPF's no formato correto.
- Para solucionar essa diferença, está implementada a função `sanitizeCPF(cpf)`, que retorna os 11 últimos dígitos do CPF 'sujo', separados corretamente.
- Essa função está sendo exportada pelo arquivo `/api/assets/sanitize.js`

#### Critério de Recomendação
<a name="criterio"></a> 
- Todo o critério está implementado no arquivo `/api/recomenda.js`
- A partir da API de histórico de compras, cria-se um vetor de produtos comprado pelo cliente requisitado na url. Esse vetor também gera um segundo, que exclui os vinhos "repetidos", selecionados pelo nome (campo "produto") e pela variedade.
	`code`
- Compara-se o tamanho desses dois vetores. Os clientes então são separados em **dois grupos** possíveis:
	- Quando o tamanho de seu histórico total é menos do que 30% maior do que o vetor de vinhos "únicos" consumidos. Ou seja, quando o cliente **não gosta de variar** nos vinhos escolhidos.
	- Quando o tamanho de seu histórico total é mais do que 30% maior do que o vetor de vinhos "únicos" consumidos. Ou seja, quando o cliente **gosta de variar** os vinhos escolhidos.
- Essa separação é realizada no trecho de código (linhas 29 a 44)
		if (meusVinhos.length / unicos.length < 1.3) {
		res.send({
				id: req.query.id,
				recomendacao: {
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
- Para o primeiro grupo, sorteamos um vinho aleatoriamente dentro de seu histórico total, ou seja, damos **maior peso para os vinhos que o cliente já pediu mais de uma vez**.
- Para o segundo grupo, sorteamos um vinho aleatoriamente, restringindo o sorteio aos vinhos que o cliente **nunca repetiu**.

#### Constantes
<a name="constantes"></a> 
- As URL's de API fornecidas pelo Velasquinho são exportadas pelo arquivo `/api/assets/consts.js`, no formato de um vetor.
- A posição 0 do vetor é correspondente à URL de cadastros, a posição 1, à URL de pedidos.
- A porta em que a aplicação ouve é definida por uma variável de ambiente. Caso ela não seja explicitamente declarada, a aplicação ouve a porta 3000. Essa variável é acessada internamente como `process.env.PORT`.
- No [deploy](#deploy) proposto, essa variável é definida pelo script de configuração do PM2, segundo o ambiente definido ("development" ou "production")

#### Deploy
<a name="deploy"></a>
- A maneira mais simples de iniciar a aplicação, de maneira ***daemonizada***, ou seja, persistente enquanto um processo do sistema, é pelo script `ecosystem.config.js`, executado com o comando `pm2 start ecosystem.config.js --env "production"`
- O ambiente de produção é configurado pelo script "production", definido no arquivo `package.json`. Na linha de comando, `npm run production`. Nesse ambiente, a aplicação escutará a porta 3001, e não dependerá de um terminal aberto para continuar a operar, reiniciando-se a cada alteração nos arquivos.
-  O ambiente de desenvolvimento é configurado pelo script "dev", definido no arquivo `package.json`. Na linha de comando, `npm run dev`. Nesse ambiente, a aplicação escutará a porta 3000, e não dependerá de um terminal aberto para continuar a operar, reiniciando-se a cada alteração nos arquivos.
- Caso o comportamento destacado não seja desejado, a aplicação pode ser iniciada pelo script "quick", definido no arquivo `package.json`. Na linha de comando, `npm run quick`. Nesse ambiente, a aplicação escutará a porta 3333, ficando atrelada ao terminal que a executou.

#### Testes
<a name="testes"></a>
- A suíte de testes foi implementada em Mocha (framework de testes), usando a biblioteca Chai (comparação/asserção). Ao todo foram implementados 8 testes unitários.
- São testados, unitariamente:
	- A Sanitização dos CPF's.
	- A conexão com as APIs Fornecidas, `STATUS_CODE == 200`
- Para executar os testes, na linha de comando, digite `npm run test`