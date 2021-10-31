//用户账号管理模块
import {
    decryptKey,
    checkPassword,
    genPwdMd5,
    encryptKey
} from './auth_v2'
import { request, getStorage } from './config_v2'

const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')

/* 新增账号
param: 
    chainName 公链名称 TNT
    accountInfo 账号管理对象 {        
        {
            "PublicKey": "公钥",
            "PrivateKeyEncrypt": "私钥密文",
            "PasswordEncrypt": "密码密文",
            "Accounts": [
                {
                    "Account": "gixgaynfcjme",
                    "Permission": [
                        "owner"
                    ],
                    "Currency": [
                        "TNT"
                    ]
                }
            ]
        }
    }
*/
export function addLocalAccount(accountInfo, chainName){    
	return new Promise(function (resolve) {
        console.log("***********")
        console.log(chainName, accountInfo)
        console.log("***********")
        storage.getItem("AccountManager_v2", async res =>{
          if(res.result == "failed"){
            console.log("重置账号管理对象")
            let AccountManager = {
                CurrentChain:chainName,
                YAS:[],
                TNT:[],
                EOS:[]
            }
            AccountManager[chainName].push(accountInfo)
            await storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
                console.log("添加账号 - OK 1") 
            })
            resolve(true)
          }
          let hasPubKey = false;
          let AccountManager = JSON.parse(res.data);
          let index;
          console.log(AccountManager)


          //判断是否已存在该公钥
          AccountManager[chainName].forEach((item, i) => {
              if(item.PublicKey == accountInfo.PublicKey){
                hasPubKey = true
                index = i
              }
          });
          //不存在则新增
          if(!hasPubKey){
            AccountManager[chainName].push(accountInfo)
            await storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
                console.log("添加账号 - OK 2") 
            })
            resolve(true)
          }

          //存在则对比账号数组
          if(typeof(AccountManager[chainName][index].Accounts) === "undefined" || AccountManager[chainName][index].Accounts.length == 0){
                AccountManager[chainName][index].Accounts = accountInfo.Accounts

                await storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
                    console.log("添加账号 - OK 3") 
                })
                resolve(true)
          }
          let hasChange = false;
          accountInfo.Accounts.forEach(item =>{
            let hasAccount = false;
            AccountManager[chainName][index].Accounts.forEach(managerItem => {
                if(managerItem.Account == item.Account){
                    hasAccount = true
                }
            });
            //发现了该公钥下新增的账号
            if(!hasAccount){
                AccountManager[chainName][index].Accounts.push(item)
                hasChange = true
            }
          })

          //结束保存
          if(!hasChange){
            resolve(true)
          }
          await storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
            console.log("添加账号 - OK 4") 
          })
          resolve(true)
        })

    });    
}

/* 删除公钥
param: 
    publicKey 被删除的公钥
    chainName 公链名称
*/
export function delLocalKey(publicKey, chainName){
    //查找该公钥
    storage.getItem("AccountManager_v2", res =>{
        let AccountManager = JSON.parse(res.data);
        AccountManager[chainName].forEach((account, index) => {
            if(account.PublicKey == publicKey){
                //删除公钥对象
                AccountManager[chainName].splice(index, 1)
                storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
                  console.log("公钥删除 - OK") 
                })
                return
            }
        });

    })   
}
//查找账号对象
export async function getLocalKey(publicKey, chainName){
    //查找该公钥
    let account = {};
    console.log("开始查找ing")
    let AccountManager = JSON.parse(await getStorage("AccountManager_v2"));
    console.log(AccountManager)

    let index;
    for(var i = 0; i < AccountManager[chainName].length; i++){
        if(AccountManager[chainName][i].PublicKey == publicKey){
            //返回公钥对象
            console.log("查到index"+i)
            index = i
            account =  AccountManager[chainName][index]
            break
        }
    }

    return account
}

/* 获取私钥明文
param: 
    password 用户输入的密码
    publicKey 公钥
    ciphertext 私钥密文
*/
export async function getPrivateKey(password, publicKey, chainName){
    //获取私钥密文
    console.log("获取私钥密文")
    let account = await getLocalKey(publicKey, chainName)
    console.log("getLocalKey ", account)
    console.log("password: ",password)
    console.log("account.PrivateKeyEncrypt: ", account.PrivateKeyEncrypt)
    let key = await decryptKey(password, publicKey, account.PrivateKeyEncrypt)
    console.log(key)
    return key.privateKey
}

/* 获取该账号在链上的完整信息
param: 
    account 用户账号 如 heng11223344
return:
    accountInfo{} 对象，内含代币资产、资源、区块等信息
*/
export async function getCurrentAccountInfo(account, chainName){
    console.log("查询链上信息中......")
    console.log(account,chainName)
    let accountInfo = {}
    let url = 'chain/get_account'
    let params = {
        account_name: account
    }
    let res = await request('post', url, params, chainName)
    if(res) {
        accountInfo = res.data
    }
    
    
    return accountInfo
}
/*更新私钥密码
params: 
    publicKey 公钥
    oldPwd 原密码
    newPwd 新密码
return:
    bool
*/
export async function updatePassword (publicKey, chainName, oldPwd, newPwd){

    //校验原密码是否正确
    let isValid = await checkPassword(publicKey, chainName, oldPwd)
    if(!isValid){
        modal.toast({
            message: '原密码错误',
            duration: 2
        })
        return false
    }
    console.log("密码校验成功 ", isValid)

    // 获取私钥
    let privateKey = await getPrivateKey(oldPwd, publicKey, chainName)

    // 加密私钥
    let enPrekey = await encryptKey(newPwd, publicKey, privateKey)
    if(!enPrekey) {
        modal.toast({
            message: '密码修改失败',
            duration: 2
        })
        return false
    }

    //生成新密码的 md5密文并替换原密文
    let pwd_md5 = await genPwdMd5(newPwd)
    console.log("新密码MD5 ", pwd_md5)
    
    storage.getItem("AccountManager_v2", res =>{
        let AccountManager = JSON.parse(res.data);
        let index;
        for(var i = 0; i < AccountManager[chainName].length; i++){
            if(AccountManager[chainName][i].PublicKey == publicKey){
                //返回公钥对象
                index = i
                break
            }
        }
        AccountManager[chainName][index].PasswordEncrypt = pwd_md5
        AccountManager[chainName][index].PrivateKeyEncrypt = enPrekey.ciphertext                
        storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
            console.log("密码更新 - OK") 
        })
        return
    })
    return true
}

//将当前账号切换到指定账号
export async function switchAccount(account, publicKey, chainName){
    let accountInfo = await getCurrentAccountInfo(account, chainName)
    accountInfo.localPublicKey = publicKey
    console.log("accountInfo: "+JSON.stringify(accountInfo))
    if (JSON.stringify(accountInfo) != "{}") {
        storage.setItem("Account",  JSON.stringify(accountInfo), res =>{
            console.log("切换账号 - OK") 
        })
        return true
    }
        
    console.log("切换账户失败")
    return false
}

//通过公钥来获取账号
//返回该公钥下的所有帐户 {"account_names":["dali.xo","happy.me","heng11223344"]}
export async function getAccountByPublicKey(publicKey, chainName){
    let url = "history/get_key_accounts"
    let params = {
        public_key: publicKey
    }
    let res = await request('post', url, params, chainName)
    if(res) {
        return res.data
    }
    return []    
}

// 根据publickey和accountname获取本地存储的账号信息
export async function getLocalAccount(accountName,publicKey, chainName) {
    let accounts = []
    accounts = JSON.parse(await getStorage("AccountManager"))

    let account = {}
    for (let index = 0; index < accounts[chainName].length; index++) {
        if(accounts[chainName][index].PublicKey == publicKey) {
            account = accounts[chainName][index]
            break
        }        
    }

    let currentAccount = {}
    if(!account.Accounts) {
        return currentAccount
    }    
    for (let index = 0; index < account.Accounts.length; index++) {
        if(account.Accounts[index].Account == accountName ) {
            currentAccount = account.Accounts[index]
            break
        }
    }
    return currentAccount
}

export async function saveTransInfo(form) {
  storage.getItem("trans_record", res =>{
    if(res.result == "failed"){
      console.log("重置转账记录对象")
      let transRecord = []
      transRecord.push(form)
      storage.setItem("trans_record",  JSON.stringify(transRecord))
      return
    }

    let trans1 = JSON.parse(res.data)
    let a = [form]
    trans1 = a.concat(trans1)
    storage.setItem("trans_record",  JSON.stringify(trans1), res =>{
      console.log("添加转账记录 - OK2") 
    })
  })

}

export async function saveHistoryVisit(form) {
    storage.getItem("history_visit", res =>{
      if(res.result == "failed"){
        console.log("重置历史浏览对象")
        let histories = []
        histories.push(form)
        storage.setItem("history_visit",  JSON.stringify(histories), res =>{
            console.log("添加历史记录 - OK1") 
        })
        return
      }

      let array = JSON.parse(res.data)
      for (let index = 0; index < array.length; index++) {
          let element = array[index];
          if(form.url == element.url){
              return
          }
      }
    //   array.push(form)
      let forms = [form]
      array = forms.concat(array)
      storage.setItem("history_visit",  JSON.stringify(array), res =>{
        console.log("添加历史记录 - OK2") 
      })
    })
  
  }

  export async function saveMyDapps(form) {
    storage.getItem("myDapps", res =>{
      if(res.result == "failed"){
        console.log("重置我的Dapps对象")
        let histories = []
        histories.push(form)
        storage.setItem("myDapps",  JSON.stringify(histories), res =>{
            console.log("添加我的Dapps记录 - OK1") 
        })
        return
      }

      let array = JSON.parse(res.data)
      for (let index = 0; index < array.length; index++) {
          let element = array[index];
          if(form.url == element.url){
              return
          }
      }
    //   array.push(form)
      let forms = [form]
      array = forms.concat(array)
      storage.setItem("myDapps",  JSON.stringify(array), res =>{
        console.log("添加我的Dapps记录 - OK2") 
      })
    })
  
  }