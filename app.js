const Chain = require("@alipay/mychain/index.node") //在 node 环境使用 TLS 协议
const fs = require("fs")
 
const accountKey = fs.readFileSync("./certs/user.pem", { encoding: "utf8" })
const accountPassword = "leo+HHXX+233"  //需要替换为自定义的 user.pem 密码
 
const keyInfo = Chain.utils.getKeyInfo(accountKey, accountPassword)
//可打印私钥和公钥，使用 16 进制
//console.log('private key:', keyInfo.privateKey.toString('hex'))
//console.log('public key:', keyInfo.publicKey.toString('hex'))
 
const passphrase = "leo+HHXX+233" //需要替换为自定义的 client.key 密码
//配置选项
let opt = {
  host: '47.102.108.6',    //目标区块链网络节点的 IP
  port: 18130,          //端口号
  timeout: 30000,       //连接超时时间配置
  cert: fs.readFileSync("./certs/client.crt", { encoding: "utf8" }),
  ca: fs.readFileSync("./certs/ca.crt", { encoding: "utf8" }),
  key: fs.readFileSync("./certs/client.key", { encoding: "utf8" }),
  userPublicKey: keyInfo.publicKey,
  userPrivateKey: keyInfo.privateKey,
  userRecoverPublicKey: keyInfo.publicKey,
  userRecoverPrivateKey: keyInfo.privateKey,
  passphrase: passphrase
}
 
//初始化一个连接实例
const chain = Chain(opt)
 
//调用 API 查询最新的一个区块数据
chain.ctr.QueryLastBlock({}, (err, data) => {
  console.log('raw data:', data)                                     //区块结构数据
  console.log('block hash:', data.block.block_header.hash)             //区块哈希
  console.log('block number:', data.block.block_header.block_number) //区块高度
})

const abi = JSON.parse(fs.readFileSync('./contract/search.abi'))
const bytecode = fs.readFileSync('./contract/search')

// const solc = require('@alipay/solc')
// const contract = fs.readFileSync('./contract/earch.sol', {encoding: 'ascii'})
// // 第二个参数设定为"1"，会开启编译优化 optimiser
// const output = solc.compile(contract, 1)
// const abi = JSON.parse(output.contracts[':CreditManager'].interface)
// const bytecode = output.contracts[':CreditManager'].bytecode


// 带上时间戳，防止合约名计算哈希后已存在
const contractName = 'contract'+Date.now()
// 初始化一个合约实例
let myContract = chain.ctr.contract(contractName, abi) 
// 部署合约，可传递初始化函数需要的参数
myContract.new(bytecode, {
  from: 'Tester001',
  // parameters: [param1, param2]
}, (err, contract, data) => {
  console.log('data is:',data)

  myContract.addUser('0xc60a9d48105950a0cca07a4c6320b98c303ad42d694a634529e8e1a0a16fcdb5' , { from: 'Tester001' }, (err, output, data) => {
    console.log('output is:', output)
  })

})