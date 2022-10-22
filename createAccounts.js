const ethers = require('ethers')
const fs = require('fs')

let accounts = []
for(let i = 0; i < 50; i ++){  //生成的帐户数量 这里是50个
    let lbcWallet = ethers.Wallet.createRandom()
    let res = {account:lbcWallet.address, key: lbcWallet.privateKey}  //格式：地址和私钥
    accounts.push(res)
}

let path = './accounts.json'  //生成的文件路径和文件名
fs.writeFileSync(path, JSON.stringify(accounts))