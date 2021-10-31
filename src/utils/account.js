//用户账号管理模块
import {
    decryptKey,
    checkPassword,
    genPwdMd5,
    encryptKey
} from './auth'
import { eosApi } from './base'
import { request, getStorage } from './config'
import {
  rpc
} from './config'
import { JsonRpc } from 'eosjs';

const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')

/* 新增账号
param: 
    accountInfo 账号管理对象 {
        {
          PublicKey : “EOS1j4h5c8cah3h5kks14”,
          PrivateKeyEncrypt: “Jsdd4h32n2n4n5vvj2j4nc8”,
          Accounts : [
            {
              Account : “heng11223344”,
              Currency : [“YAS”, “IBT”, “COM”]
            },
            {
              Account : “happy.me”,
              Currency : [“IBT”, “COM”]
            }
          ]
        }
    }
*/
export function addLocalAccount(accountInfo){
    console.log("***********")
    console.log(accountInfo)
    console.log("***********")
    storage.getItem("AccountManager", res =>{
      if(res.result == "failed"){
        console.log("重置账号管理对象")
        let AccountManager = []
        AccountManager.push(accountInfo)
        storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
            console.log("添加账号 - OK1") 
        })
        return
      }
      let hasPubKey = false;
      let AccountManager = JSON.parse(res.data);
      let index;
      console.log(AccountManager)


      //判断是否已存在该公钥
      AccountManager.forEach((item, i) => {
          if(item.PublicKey == accountInfo.PublicKey){
            hasPubKey = true
            index = i
          }
      });
      //不存在则新增
      if(!hasPubKey){
        AccountManager.push(accountInfo)
        console.log("我这新增")
        storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
            console.log("添加账号 - OK2") 
        })
        return
      }

      //存在则对比账号数组
      if(typeof(AccountManager[index].Accounts) === "undefined" || AccountManager[index].Accounts.length == 0){
            AccountManager[index].Accounts = accountInfo.Accounts

            storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
                console.log("添加账号 - OK3") 
            })
            return
      }
      let hasChange = false;
      accountInfo.Accounts.forEach(item =>{
        let hasAccount = false;
        AccountManager[index].Accounts.forEach(managerItem => {
            if(managerItem.Account == item.Account){
                hasAccount = true
            }
        });
        //发现了该公钥下新增的账号
        if(!hasAccount){
            AccountManager[index].Accounts.push(item)
            hasChange = true
        }
      })

      //结束保存
      if(!hasChange){
        return
      }
      storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
        console.log("添加账号 - OK4") 
      })
    })
}

/* 删除公钥
param: 
    publicKey 被删除的公钥
*/
export function delLocalKey(publicKey){
    //查找该公钥
    storage.getItem("AccountManager", res =>{
        let AccountManager = JSON.parse(res.data);
        AccountManager.forEach((account, index) => {
            if(account.PublicKey == publicKey){
                //删除公钥对象
                console.log("删除对象： ", account)
                AccountManager.splice(index, 1)
                storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
                  console.log("私钥删除 - OK") 
                })
                return
            }
        });

    })   
}
//查找账号对象
export async function getLocalKey(publicKey){
    //查找该公钥
    let account = {};
    console.log("开始查找ing")
    let AccountManager = JSON.parse(await getStorage("AccountManager"));
    console.log(AccountManager)

    let index;
    for(var i = 0; i < AccountManager.length; i++){
        if(AccountManager[i].PublicKey == publicKey){
            //返回公钥对象
            console.log("查到index"+i)
            index = i
            account =  AccountManager[index]
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
export async function getPrivateKey(password, publicKey){
    //获取私钥密文
    console.log("获取私钥密文")
    let account = await getLocalKey(publicKey)
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
export async function getCurrentAccountInfo(account){
    console.log("查询链上信息中......")
    console.log(account)
    let accountInfo = {}
    let url = 'chain/get_account'
    let params = {
        account_name: account
    }
    let res = await request('post', url, params)
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
export async function updatePassword (publicKey, oldPwd, newPwd){

    //校验原密码是否正确
    let isValid = await checkPassword(publicKey, oldPwd)
    if(!isValid){
        modal.toast({
            message: '原密码错误',
            duration: 2
        })
        return false
    }
    console.log("密码校验成功 ", isValid)

    // 获取私钥
    let privateKey = await getPrivateKey(oldPwd, publicKey)

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
    
    storage.getItem("AccountManager", res =>{
        let AccountManager = JSON.parse(res.data);
        let index;
        for(var i = 0; i < AccountManager.length; i++){
            if(AccountManager[i].PublicKey == publicKey){
                //返回公钥对象
                index = i
                break
            }
        }
        AccountManager[index].PasswordEncrypt = pwd_md5
        AccountManager[index].PrivateKeyEncrypt = enPrekey.ciphertext                
        storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
            console.log("密码更新 - OK") 
        })
        return
    })
    return true
}

//将当前账号切换到指定账号
export async function switchAccount(account, publicKey){
    let accountInfo = await getCurrentAccountInfo(account)
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
export async function getAccountByPublicKey(publicKey){
    // let { JsonRpc } = require('eosjs');
    // let rpc = new JsonRpc('https://rpc.yas.plus');
    let url = "history/get_key_accounts"
    let params = {
        public_key: publicKey
    }
    let res = await request('post', url, params)
    if(res) {
        return res.data
    }
    // let res = await rpc.history_get_key_accounts(publicKey)
    return []    
}

// 根据publickey和accountname获取本地存储的改账号信息
export async function getLocalAccount(accountName,publicKey) {
    let accounts = []
    // storage.getItem("AccountManager", res =>{
    //     accounts = JSON.parse(res.data)
    //     console.log("获取到账号列表" + JSON.stringify(accounts))
    //     console.log(accounts)
    // })
    accounts = JSON.parse(await getStorage("AccountManager"))

    let account = {}
    for (let index = 0; index < accounts.length; index++) {
        if(accounts[index].PublicKey == publicKey) {
            account = accounts[index]
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
      console.log("重置账号管理对象")
      let AccountManager = []
      AccountManager.push(form)
      storage.setItem("trans_record",  JSON.stringify(AccountManager), res =>{
          console.log("添加账号 - OK1") 
      })
      return
    }

    let trans1 = JSON.parse(res.data)
    let a = [form]
    // trans1.push(form)
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

  export async function saveMyDapps(form,chainName) {
    
    // await storage.getItem("myDapps", async res =>{
    //   if(res.result == "failed"){
    //     console.log("重置我的Dapps对象")
    //     let histories = []
    //     histories.push(form)
    //     storage.setItem("myDapps",  JSON.stringify(histories), res =>{
    //         console.log("添加我的Dapps记录 - OK1") 
    //     })
    //     return
    //   }

    //   let array = JSON.parse(res.data)
    //   for (let index = 0; index < array.length; index++) {
    //       let element = array[index];
    //       if(form.url == element.url){
    //           return
    //       }
    //   }
    // //   array.push(form)
    //   let forms = [form]
    //   array = forms.concat(array)
    //   storage.setItem("myDapps",  JSON.stringify(array), res =>{
    //     console.log("添加我的Dapps记录 - OK2") 
    //   })
    // })


    let myDapps = await getStorage(chainName+"_MyDapps")
    if(!myDapps) {
        let histories = []
        histories.push(form)
        await storage.setItem(chainName+"_MyDapps",  JSON.stringify(histories), res =>{
            console.log("添加我的Dapps记录 - OK1") 
        })
        return 
    }

    
      let array = JSON.parse(myDapps)
      
      for (let index = 0; index < array.length; index++) {
          let element = array[index];
          if(form.url == element.url){
              return
          }
      }
      let forms = [form]
      array = forms.concat(array)
      await storage.setItem(chainName+"_MyDapps",  JSON.stringify(array), res =>{
        console.log("添加我的Dapps记录 - OK2") 
      })
  
  }