// import {PrivateKey} from 'eosjs/dist/eosjs-ecc-migration'
import { async } from 'q'

const { Api, JsonRpc } = require('eosjs');
const ecc = require('eosjs/dist/eosjs-ecc-migration').ecc
// const ecc = require('eosjs-ecc')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const privateKeys = ['5KVQ9WhxWeuF3KsysLgYfjiwYskJsUvvuGv1BNEA6ygJQqQyv6r'];
const signatureProvider = new JsSignatureProvider(privateKeys);
// const rpc = new JsonRpc('https://yas.maiziqianbao.net');
const rpc = new JsonRpc('http://openapi.eos.ren');
export const api = new Api({ rpc, signatureProvider })


//============EosAPI 查询链上数据============
const nodeConfigs = {
  math: {
    host: "yas.maiziqianbao.net",
    port: 443,
    protocol: "https",
    chainId: "ed8636abfe625d99fc9a759d49a016fd8dcae9193676a020aae2540c9fffe32f"
  },
  eosapi: {
    host: "http://openapi.eos.ren",
    port: 80,
    protocol: "http",
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
  },

}
const config = nodeConfigs.math
// let EosApi = require('eosjs-api')
let options = {
  httpEndpoint: config.protocol + "://" + config.host, // default, null for cold-storage
  verbose: false, // API logging
  fetchConfiguration: {}
}
export const eosApi = "EosApi(options)"

//============接口============
export async function createKey(){
  let key = {
    privateKey:"",
    publicKey:""
  }
  await ecc.randomKey("",{secureEnv: true}).then(privateKey => {
    console.log("获取到privateKey")
    key.privateKey = privateKey})
  key.publicKey = ecc.privateToPublic(key.privateKey)
  return key;
}
export async function creatRandomKey(){
  let priv = await ecc.randomKey()
  return priv
}
//通过种子创建私钥，当种子不变时，生成的私钥也不会改变
export async function createKeyWithSeed(seed){
  let priv = await ecc.seedPrivate(seed)
  return priv
}
//通过传入的私钥生成公钥
export async function genPublicKey(privateKey){
  let publicKey = await ecc.privateToPublic(privateKey)
  console.log("获取到公钥"+publicKey)
  return publicKey
}
//校验公钥
export async function CheckPublicKeyValid(publicKey4Check){
  console.log("检测公钥："+publicKey4Check)
  let valid = await ecc.isValidPublic(publicKey4Check)
  return valid
}
//校验私钥
export async function CheckPrivateKeyValid(privateKey4Check){
  console.log("检验私钥："+privateKey4Check)
  let valid = await ecc.isValidPrivate(privateKey4Check)
  return valid
}
//签名 priv
export async function sign(data, privateKey){
  let signature = ecc.sign(data, privateKey)
  return signature
}
//自定义 transact
export async function transact(actions){
  const result = await api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result
}
