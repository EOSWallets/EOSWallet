//私钥加解密
import md5 from 'js-md5';
import {
    CheckPublicKeyValid,
    CheckPrivateKeyValid
} from './base'
import {
    getLocalKey, getAccountByPublicKey
} from './account'
import { AESKey } from './config' 

const Cryptojs = require('crypto-js');
const iv = Cryptojs.enc.Utf8.parse('MjAleF1i3dccXECuy4wJILzxOAnELEiN');   //密钥偏移量
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')

/*生成私钥加密数据
param: 
    password string 私钥密码 
    privateKey string 私钥
return:
    result :{
        success: bool //成功与否
        ciphertext: string //生成的密文
    }
    bool 成功与否 true/false
*/
export async function encryptKey(password, publicKey, privateKey){
    //校验公私钥是否合法
    // let isValid = await CheckPublicKeyValid(publicKey);
    // console.log("CheckPublicKeyValid: ", isValid)
    // if (!isValid){
    //     modal.toast({
    //         message: '公钥不合法，请重新输入',
    //         duration: 2
    //     })
    //     return
    // }
    let isValid = await CheckPrivateKeyValid(privateKey);
    console.log("CheckPrivateKeyValid: ", isValid)
    if (!isValid){
        modal.toast({
            message: '私钥不合法，请重新输入',
            duration: 2
        })
        return
    }
    //获取数据
    let result = {
        success: false,
        ciphertext:""
    }
    let Key = AESKey + password + publicKey
    Key = md5(Key)  
    
    let ciphertext = Encrypt(Key, privateKey)
    if(ciphertext.length == 0){
        result.success = false
        return result
    }
    result.success = true
    result.ciphertext = ciphertext
    return result
}

/*解密获取密钥
param: 
    password string 私钥密码 
    ciphertext string 密文
return:
    result :{
        success: bool //成功与否
        privateKey: string //生成的密文
    }
    bool 成功与否 true/false
*/
export function decryptKey(password, publicKey, ciphertext){
    //获取数据
    let result = {
        success: false,
        privateKey:""
    }
    if(AESKey.length == 0){
        return result
    }
    let Key = AESKey + password + publicKey
    Key = md5(Key)
    //解密 
    console.log("开始解密")   
    let data = Decrypt(Key, ciphertext)
    console.log(data)
    if(data.length == 0){
        result.success = false
        return result
    }
    console.log("开始解密1")  
    result.privateKey = data
    result.success = true
    return result
}
//生成密码的MD5，存于账号对象中
export async function genPwdMd5(password){
    let pwd_data = password + AESKey
    let pwd_md5 = md5(pwd_data)
    return pwd_md5
}

//校验密码是否正确
export async function checkPassword(publicKey, password){
    console.log("publicKey："+publicKey)
    let pwd_data = password + AESKey
    let pwd_md5 = md5(pwd_data)
    let account = await getLocalKey(publicKey)
    console.log("取到account")
    console.log(account)
    console.log(account.PasswordEncrypt)
    console.log(pwd_md5)
    if(account.PasswordEncrypt == pwd_md5){
        return true
    }
    return false
}

//发起交易时的密码校验（发起交易时默认是使用当前帐号发起）
export async function checkAuth(permission, password){
    if(permission != "active" && permission != "owner"){
        modal.toast({
            message: '账号权限错误',
            duration: 2
        })
        return
    }
    let Account;
    await storage.getItem("Account", res =>{
        if(res.result == "failed"){
            modal.toast({
                message: '当前账号为空',
                duration: 2
            })
            return
        }
        Account = JSON.parse(res.data);
    })
    let permissions = Account.permissions;
    let publicKey;
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].perm_name == permission){
            publicKey = permissions[i].required_auth.keys[0].key //此处有疏漏，keys是个数组，似乎是说这个账号可以对应多个公钥，不同的公钥有不同的权重？
            break;
        }
    }
    let isValid = await checkPassword(publicKey, password)
    let res = {
        isValid: isValid,
        publicKey: publicKey
    }
    return res
}

// export async function getAccountByPublicKey(permission){
//     let permissions = Account.permissions;
//     let publicKey;
//     for(let i = 0; i < permissions.length; i++){
//         if(permissions[i].perm_name == permission){
//             publicKey = permissions[i].required_auth.keys[0].key //此处有疏漏，keys是个数组，似乎是说这个账号可以对应多个公钥，不同的公钥有不同的权重？
//             break;
//         }
//     }

// }


//==============================================================
//工具方法
function Encrypt(key, word) {
    let srcs = Cryptojs.enc.Utf8.parse(word);
    key = Cryptojs.enc.Utf8.parse(key);
    let encrypted = Cryptojs.AES.encrypt(srcs, key, { iv: iv, mode: Cryptojs.mode.CBC, padding: Cryptojs.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}
//解密方法
function Decrypt(key, word) {
    let encryptedHexStr = Cryptojs.enc.Hex.parse(word);
    key = Cryptojs.enc.Utf8.parse(key);
    let srcs = Cryptojs.enc.Base64.stringify(encryptedHexStr);
    let decrypt = Cryptojs.AES.decrypt(srcs, key, { iv: iv, mode: Cryptojs.mode.CBC, padding: Cryptojs.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(Cryptojs.enc.Utf8);
    return decryptedStr.toString();
}
