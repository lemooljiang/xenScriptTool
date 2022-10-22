let fs = require('fs')
let HDWalletProvider = require("@truffle/hdwallet-provider") 
let Web3 = require('web3')

let url = "https://bsc-dataseed1.defibit.io"      //bsc节点
// let url = "https://polygon-rpc.com"           //polygon节点
// let url = "https://rpc.api.moonbeam.network"  //moonbeam节点

let xenCrypto_eth = "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8"    //xen合约地址
let xenCrypto_bsc = "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e"
let xenCrypto_moonccbeam = "0xb564A5767A00Ee9075cAC561c427643286F8F4E1"

let toXen = "0x5278c6A7B0E805c15a8xxxxxxx"  //把xen归集到此帐户上
let addGas = 3e9  //3GWei 比网络的平均gas稍高的部分

async function getAccounts(){
  let res = fs.readFileSync('./accounts.json', "utf8")
  return JSON.parse(res)
}

async function getJson(){
  let res = fs.readFileSync('./xenCrypto.json', "utf8")
  return JSON.parse(res) 
}

async function getGasPrice(){
  let web3Provider2 = new Web3.providers.HttpProvider(url)
  let web4= new Web3(web3Provider2)
  let s = await web4.eth.getGasPrice()
  return parseFloat(s) + addGas
}

function timeFormat(timestamp){
  //把时间戳转成可读形式 yyyy-MM-dd hh:mm:ss
  let date = new Date(timestamp * 1000)
  let Y = date.getFullYear() + '-'
  let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  let D = date.getDate() + ' '
  let h = date.getHours() + ':'
  let m = date.getMinutes()

  return Y+M+D+h+m
}


//开启挖矿，合约的claimRank函数
async function xenMint(){
  try {   
    let json = await getJson()
    let gasPrice = await getGasPrice()
    let minters = await getAccounts()

    for(let i = 0; i < minters.length; i ++){
      let web3Provider = new HDWalletProvider(minters[i].key, url)
      let web3 = new Web3(web3Provider)
      let instance = new web3.eth.Contract(json, xenCrypto_bsc)

      let option = {
        from: minters[i].account,
        gasPrice: gasPrice
      }

      //7days
      instance.methods.claimRank(7).send(option)
      console.log(868,i, "mint")
    }
  } catch(e){
    console.log("错误！\n" + e)
    return e
  }
}
xenMint()

//查询各帐户的挖矿数据
async function checkInfo(){
  try {   
    let json = await getJson()
    let minters = await getAccounts()

    let web3Provider = new Web3.providers.HttpProvider(url)
    let web3 = new Web3(web3Provider)
    let instance = new web3.eth.Contract(json, xenCrypto_bsc) 

    for(let i = 0; i < minters.length; i ++){
      //查询挖矿信息
      let info = await instance.methods.userMints(minters[i].account).call()
      console.log(66, info)
      let time = timeFormat(info.maturityTs)
      console.log(145, i, time)
    }
  } catch(e){
    console.log("错误！\n" + e)
    return e
  }
}
//checkInfo()


//提现收益， 合约的claimRewards函数
async function claimRewards(){
  try {   
    let json = await getJson()
    let minters = await getAccounts()
    let gasPrice = await getGasPrice()

    for(let i = 0; i < minters.length; i ++){
      let web3Provider = new HDWalletProvider(minters[i].key, url)
      let web3 = new Web3(web3Provider)
      let instance = new web3.eth.Contract(json, xenCrypto_bsc)

      let option = {
        from: minters[i].account,
        gasPrice: gasPrice
      }
      instance.methods.claimMintReward().send(option)
      console.log(536,i, "claim rewards")
    }
  } catch(e){
    console.log("错误！\n" + e)
    return e
  }
}
// claimRewards()

//把XEN归集到一个帐户 toXen
async function xenTransfer(){
  try {   
    let json = await getJson()
    let minters = await getAccounts()
    let gasPrice = await getGasPrice()

    for(let i = 0; i < minters.length; i ++){
      let web3Provider = new HDWalletProvider(minters[i].key, url)
      let web3 = new Web3(web3Provider)
      let instance = new web3.eth.Contract(json, xenCrypto_bsc)

      let option = {
        from: minters[i].account,
        gasPrice: gasPrice
      }

      let amount = await instance.methods.balanceOf(minters[i].account).call()
      instance.methods.transfer(toXen, amount).send(option)
      console.log(868,i)
    }
  } catch(e){
    console.log("错误！\n" + e)
    return e
  }
}
// xenTransfer()