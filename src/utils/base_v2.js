const ecc = require('eosjs/dist/eosjs-ecc-migration').ecc

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
