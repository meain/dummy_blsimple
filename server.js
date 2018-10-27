var Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const port = 8800
const app = express()

app.use(morgan('dev'))
app.use(cors()) // we might have to chage the nginx max_value as well
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const code = fs.readFileSync('hackathon.sol').toString()
const compiledCode = solc.compile(code)
const abiDef = JSON.parse(compiledCode.contracts[':PharmaData'].interface)
const bytecode = compiledCode.contracts[':PharmaData'].bytecode

var con = web3.eth.contract(abiDef)
let contract
con.new({ data: bytecode, from: web3.eth.accounts[0], gas: 4700000 }, (e, c) => {
  contract = c
})

const pharma = 'one'

app.post('/addData', (req, res, next) => {
  const data = req.body

  const cro = data.cro
  const sat = data.sat
  console.log('cro, sat:', cro, sat)

  contract.addData.sendTransaction(pharma, cro, sat, { from: web3.eth.accounts[0], gas: 4200000 })
  res.json({ status: 'OK' })
})

app.post('/getData', (req, res, next) => {
  const length = contract.getDataLength.call(pharma).toNumber()
  console.log('length:', length)

  if (length > 0) {
    for (let i = 0; i < length; i++) {
      info = contract.getData.call(pharma, i)
      console.log('info:', info)
    }
  }

  res.json({ status: 'OK' })
})

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`                                     > server :port(${port})`)
})
