let fs = require('fs')
let HDWalletProvider = require("@truffle/hdwallet-provider") 
let Web3 = require('web3')

let url = "https://bsc-dataseed1.defibit.io"
// let url = "https://polygon-rpc.com"
// let url = "https://eth-mainnet.g.alchemy.com"
// let url = "https://rpc.api.moonbeam.network"


//提供gas的帐户  地址和私钥
let minter = "0x5278c6A7B0E805c15a8Fxxxx" 
let key = "xxx"

//webprovider
let web3Provider = new HDWalletProvider(key, url)
let web3 = new Web3(web3Provider)
let addGas = 3e9  //3 GWei 比网络的平均gas稍高的部分

async function getAccounts(){
  let res = fs.readFileSync('./accounts.json', "utf8")
  return JSON.parse(res)
}

async function getGasPrice(){
  //查询和计算gas
  let web3Provider2 = new Web3.providers.HttpProvider(url)
  let web4= new Web3(web3Provider2)
  let s = await web4.eth.getGasPrice()
  return parseFloat(s) + addGas
}

async function transfer(){
  let accounts = await getAccounts()
  let amount = web3.utils.toWei('0.02', 'ether')  //0.02BNB可以玩好几轮啰
  let gas = 21000  
  let gasPrice = await getGasPrice()
  for(let i = 1; i < accounts.length; i ++){
    let option = {
      from: minter,
      to:accounts[i].account,
      value: amount,
      gas: gas,
      gasPrice: gasPrice}
   
   web3.eth.sendTransaction(option)  //逐一转帐
   console.log(899,i)

  // let balance = await web3.eth.getBalance(accounts[i].account)   //查询下每个帐户的余额
  // console.log(112, accounts[i].account, "balance", web3.utils.fromWei(balance, 'ether'))    
  }
}
transfer()
