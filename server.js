const Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')

// compile sol file
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const code = fs.readFileSync('hackathon.sol').toString()
const compiledCode = solc.compile(code)

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

console.log(compiledCode.errors)

const abi = JSON.parse(compiledCode.contracts[':PharmaData'].interface)
let consentContract = web3.eth.contract(abi)
const bytecode = compiledCode.contracts[':PharmaData'].bytecode

const makeContract = () => {
  return new Promise((resolve, reject) => {
    let deployedContract = consentContract.new(
      { data: bytecode, from: web3.eth.accounts[0], gas: 4700000 },
      (error, contract) => {
        if (!error) {
          if (!deployedContract.address) {
            // console.log( 'Contract transaction send: TransactionHash: ' + contract.transactionHash + ' waiting to be mined...')
          } else {
            // console.log('Contract mined! Address: ' + deployedContract.address)
            let contractInstance = consentContract.at(deployedContract.address)
            resolve({ contract: contractInstance, web3: web3 })
          }
        } else {
          reject(error)
        }
      }
    )
  })
}

let contract
let w3
makeContract()
  .then(d => {
    contract = d.contract
    w3 = d.web3
  })
  .catch(err => {
    console.log('err:', err)
  })

app.post('/addData', (req, res, next) => {
  const data = { cro: 'cro', sat: 'sat' }
  const pharma = 'PharmaOne'
  const cro = 'cro'
  const sat = 'sat'

  contract.addData.call(pharma, cro, sat)
  const length = contract.getDataLength.call(pharma).toNumber()
  console.log('length:', length)

  res.json({ status: 'OK' })
})

app.post('/getData', (req, res, next) => {
  const pharma = 'PharmaOne'

  const length = contract.getDataLength.call(pharma).toNumber()
  console.log('length:', length)

  if (length > 0) {
    info = contract.getData.call(pharma, 0)
    console.log('info:', info)
  }

  res.json({ status: 'OK' })
})

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`                                     > server :port(${port})`)
})
