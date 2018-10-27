const Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')

// compile sol file
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const code = fs.readFileSync('hackathon.sol').toString()
const compiledCode = solc.compile(code)

console.log(compiledCode.errors)

const abi = JSON.parse(compiledCode.contracts[':ConsentForm'].interface)
let consentContract = web3.eth.contract(abi)
const bytecode = compiledCode.contracts[':ConsentForm'].bytecode

function makeContract() {
  return new Promise((resolve, reject) => {
    let deployedContract = consentContract.new(
      { data: bytecode, from: web3.eth.accounts[0], gas: 4700000 },
      (error, contract) => {
        if (!error && deployedContract.address) {
          let contractInstance = consentContract.at(deployedContract.address)
          resolve({ contract: contractInstance, web3: web3 })
        } else {
          reject(error)
        }
      }
    )
  })
}
