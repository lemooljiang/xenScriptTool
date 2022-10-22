# XEN批量收菜工具
一些本地脚本，用以XEN合约的批量交互。

## 项目本地安装和使用
本地要先安装nodejs
```
npm install

node createAccounts.js
```

## 主要文件和函数的用法
```
1. createAccounts.js
批量生成以太帐户，json的格式保存。

2. transferGas.js
批量给帐户转帐些gas费用

3. mintScript_bsc.js
文件中有三个主要函数：
    a. xenMint, 开启挖矿，合约的claimRank函数
    b. claimRewards, 提现收益， 合约的claimRewards函数
    c. xenTransfer, 把XEN归集到一个帐户toXen
```