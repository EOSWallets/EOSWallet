import { request } from './config_v2'
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const {convertLegacyPublicKey} = require('eosjs/dist/eosjs-numeric')
const modal = weex.requireModule('modal');
import {
  getPrivateKey,getStorage
} from './account_v2'
import {
  ContractAccounts,
  ContractAccounts2,
  getRpc,
  cpuPrice,
  netPrice
} from './config_v2'
import { getCurrentChain } from './chain'
                 
const { TextEncoder, TextDecoder } = require('text-encoding'); 

//发起交易
export async function transfer(from, to, symbols, quantity, memo, publicKey, permission, password, chainName){
  console.log("起发交易......")
  //生成 api 
  let privateKeys = []
  let privateKey = await getPrivateKey(password, publicKey, chainName)
  privateKeys.push(privateKey)
  const signatureProvider = new JsSignatureProvider(privateKeys);
  let rpc = await getRpc(chainName);
  let api = new Api({ rpc, signatureProvider,textDecoder: new TextDecoder(), textEncoder: new TextEncoder()})
  
  //获取当前公链
  // let chain = await getCurrentChain()
  //发起交易
  let result = {}
  console.log("转账数据",JSON.stringify({
    actions: [{
      account: ContractAccounts[chainName][symbols],
      name: "transfer",
      authorization: [{
          actor: from,
          permission: permission
      }],
      data: {
        from: from,
        to: to,
        quantity: quantity + " " + symbols,
        memo: memo
      }
    }]
  }))
  try {
    result = await api.transact({
      actions: [{
        account: ContractAccounts[chainName][symbols],
        name: "transfer",
        authorization: [{
            actor: from,
            permission: permission
        }],
        data: {
          from: from,
          to: to,
          quantity: quantity + " " + symbols,
          memo: memo
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    if(result==false) {
      result = {}
    }
  } catch (error) {
    result = {}
    console.log("转账失败"+error)
  }
  
  api = ""
  privateKey = ""
  privateKeys = []
  return result
}


export async function getActionHistory(accountName,chainName){
  let rpc = await getRpc(chainName);
  let res = await rpc.history_get_actions(accountName, -1, -10000)
  console.log("res: ", res)
  let actions = res.actions
  let transFrom = []
  let transTo = []
  let transAll = []
  for (let index = 0; index < actions.length; index++) {
    let action = actions[index];
    if(action.action_trace.act.name == "transfer") {
      transAll.push(action)
    }
    if(action.action_trace.act.name == "transfer" && action.action_trace.act.data.from == accountName) {
      transFrom.push(action)
    }
    if(action.action_trace.act.name == "transfer" && action.action_trace.act.data.to == accountName) {
      transTo.push(action)
    }
  }

  console.log("获取到transfer")
  console.log(transFrom)
  console.log(transTo)
  return {
    all: transAll,
    from: transFrom,
    to: transTo
  }
}

  //取得账户代币余额，默认为当前公链
  export async function getCurrencyBalance(account, symbols) {
    //获取当前公链
	console.log("获取代币余额开始")
    let chain = await getCurrentChain()
    let currentBalance = "null"
	console.log("获取代币余额过程",ContractAccounts)
    let contractAccount = ContractAccounts[chain.ChainName][symbols]
	console.log("获取代币余额",JSON.stringify(contractAccount))
    if (!contractAccount) {
      return
    }
    let params = {
      code: contractAccount,
      account: account,
      symbol: symbols
    }
    let url = "chain/get_currency_balance"
    let res = await request('post', url, params, chain.ChainName)
    console.log(res)
	if(res.data.length == 0){
		return 0
	}
    currentBalance = res.data[0].replace(symbols, "")
    return currentBalance
  }
  
  /*取得账户资源余额，默认为当前公链
  params: account 账号
  return:{
    accountInfo:{},
    cpu:{
      available: 155264609,
      max: 155276768,
      self_weight: "10.0000 YAS",
      total_weight: "11.0000 YAS",
      used: 12159
    },
    net:{
      available: 1479305840,
      max: 1479307864,
      self_weight: "1.0000 YAS",
      total_weight: "2.0000 YAS",
      used: 2024
    },
    ram:{      
      quota: 32015
      usage: 21485
    }
  }
  */
  export async function getResourceBalance(account) {
    console.log("资源查询中...... ")
    //获取当前公链
    let chain = await getCurrentChain()
    let resource = {
        accountInfo : {},
        cpu : {},
        net : {},
        ram : {},
        receiveAccounts: []
    }
    let accountInfo = {}
    let url = 'chain/get_account'
    let params = {
        account_name: account
    }
    let res = await request('post', url, params, chain.ChainName)
    console.log(res)
    if(!res || res == "" || res.length == 0) {
        return resource
    }
    accountInfo = res.data
    resource.accountInfo = accountInfo
    resource.cpu = accountInfo.cpu_limit
    resource.net = accountInfo.net_limit
    if(accountInfo.total_resources) {
      resource.cpu.total_weight = accountInfo.total_resources.cpu_weight;
      resource.net.total_weight = accountInfo.total_resources.net_weight;
    }
    
    if(accountInfo.self_delegated_bandwidth) {
      console.log(accountInfo.self_delegated_bandwidth.net_weight)
      resource.cpu.self_weight = accountInfo.self_delegated_bandwidth.cpu_weight;
      resource.net.self_weight = accountInfo.self_delegated_bandwidth.net_weight;
    }

    let ram = {
      quota:accountInfo.ram_quota,
      usage:accountInfo.ram_usage
    }
    resource.ram = ram
    //给别人抵押的
    
    console.log("账号信息：")
    console.log(resource)
    params = {
      json: true,
      code: chain.ContractAccount,
      scope: account,
      table: "delband",
      limit: 10000,
      lower_bound: 0,
      uppper_bound: -1
    }
	console.log("查询余额",JSON.stringify(params))
    url = "chain/get_table_rows"
    res = await request('post', url, params, chain.ChainName)
    console.log(res)
    if(!res) {
      return
    }
    let receiveAccounts = res.data
    console.log("receiveAccounts: ", receiveAccounts)
    resource.receiveAccounts = receiveAccounts
    return resource
  }

  // 获取为他人抵押的账号，默认为当前公链
  export async function getDelegatedToOther(account){
    //获取当前公链
    let chain = await getCurrentChain()
    let limit = 1000;
    let params = {
      json: true,
      code: ContractAccounts2[chain.ChainName][symbols],
      scope: account,
      table: "delband",
      limit: limit,
      lower_bound: 0,
      uppper_bound: -1
    }
  
    // let receiveAccounts = await eosApi.getTableRows(params);
    let url = "chain/get_table_rows"
    let res = await request('post', url, params, chain.ChainName)
    console.log(res)
    if(!res) {
      return
    }
    receiveAccounts = res.data
    while(receiveAccounts.more){
      params.limit += 1000;
      let res = await request('post', url, params, chain.ChainName)
      if(!res) {
        return
      }
      receiveAccounts = res.data
    }
    return receiveAccounts
  }

  /* 为本账号抵押
  params:
    resourceType 资源类型 cpu/net
    quantity 抵押数量 YAS
  */

  // export function delegatedSelf(resourceType, quantity){
  //   let action = {
  //     account: ContractAccounts[symbols],
  //     name: "delegatebw",
  //     authorization: [authorization],
  //     data: {
  //       from: data.from,
  //       receiver: data.receiver,
  //       stake_cpu_quantity: data.stake_cpu_quantity,
  //       stake_net_quantity: data.stake_net_quantity,
  //       transfer: false
  //     }
  //   }
    
  //   return api.transact({ 
  //     actions: [action] 
  //   },{
  //     blocksBehind: 3,
  //     expireSeconds: 30
  //   })
  // }

  // 创建新账号
  export async function createNewAccount(form, chainName) {
    console.log("开始创建账号......",form, chainName)
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey, chainName)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(chainName);
    let api = new Api({ rpc, signatureProvider })
    console.log(api)
    //获取当前公链
    // let chain = await getCurrentChain()
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[chainName][form.symbols],
            name: "newaccount",
            authorization: [{
                actor: form.creator,
                permission: form.permission
            }],
            data: {
              creator: form.creator,
              name: form.name,
              owner: {
                "threshold": 1,
                "keys": [
                    {
                        "key": form.owner,
                        "weight": 1
                    }
                ],
                "accounts": [],
                "waits": []
              },
              active: {
                "threshold": 1,
                "keys": [
                    {
                        "key": form.active,
                        "weight": 1
                    }
                ],
                "accounts": [],
                "waits": []
              }
            }
          },
          {
            account: ContractAccounts2[chainName][form.symbols],
            name: "buyrambytes",
            authorization: [{
                actor: form.creator,
                permission: form.permission
            }],
            data: {
              payer: form.creator,
              receiver: form.name,
              bytes: form.ramBytes
            }
          },
          {
            account: ContractAccounts2[chainName][form.symbols],
            name: "delegatebw",
            authorization: [{
                actor: form.creator,
                permission: form.permission
            }],
            data: {
              from: form.creator,
              receiver: form.name,
              stake_net_quantity: netPrice + " " + form.symbols,
              stake_cpu_quantity: cpuPrice + " " + form.symbols,
              transfer: false
            }
          },
        ]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.log("res: ", result)
      if(!result) {
        console.log("!result")
        result = {}
      }
      // 账号创建结束
      return result
    } catch (error) {
      result = {}
      console.log("创建账号失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []
  }


  export async function getRamPrice(ram) {
    let params = {
      json: true,
      code: "eosio",
      scope: "eosio",
      table: "rammarket",
      limit: 10,
      lower_bound: 0,
      uppper_bound: -1
    }
    
    console.log(ram)
    //获取当前公链
    let chain = await getCurrentChain()

    let url = "chain/get_table_rows"
    let result = await request('post', url, params, chain.ChainName)
    console.log(result)
    if(!result) {
      return
    }
    let res = result.data
    let quoteBalance = parseFloat(res.rows[0].quote.balance.substring(0, res.rows[0].quote.balance.length-4))
    let baseBalance = parseFloat(res.rows[0].base.balance.substring(0, res.rows[0].base.balance.length-4))
    let price = (ram * quoteBalance) / (ram + baseBalance / 1024)
    
    console.log("最终价格为"+ Math.round(price*1000)/1000)
    return Math.round(price*10000)/10000
  }

  // 资源抵押，默认为当前公链
  export async function delegate(form) {
    console.log("开始新增抵押......")
    //获取当前公链
    let chain = await getCurrentChain()
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey, chain.ChainName)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(chain.ChainName);
    console.log("资源抵押rpc",rpc)
    let api = new Api({ rpc, signatureProvider })
	console.log("资源抵押api",api)
    //发起交易
    let result = {}
    console.log("action:",JSON.stringify({
      actions: [
        {
          account: ContractAccounts2[chain.ChainName][form.symbols],
          name: "delegatebw",
          authorization: [{
              actor: form.account,
              permission: form.permission
          }],
          data: {
            from: form.account,
            receiver: form.receiver,
            stake_net_quantity: form.netPrice + " " + form.symbols,
            stake_cpu_quantity: form.cpuPrice + " " + form.symbols,
            transfer: form.isTransfer
          }
        },
      ]
    }))
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[chain.ChainName][form.symbols],
            name: "delegatebw",
            authorization: [{
                actor: form.account,
                permission: form.permission
            }],
            data: {
              from: form.account,
              receiver: form.receiver,
              stake_net_quantity: form.netPrice + " " + form.symbols,
              stake_cpu_quantity: form.cpuPrice + " " + form.symbols,
              transfer: form.isTransfer
            }
          },
        ]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      if(!result) {
        result = {}
      }
    } catch (error) {
      result = {}
      console.log("资源抵押失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []
    // 账号创建结束
    return result
  }
  
  export async function updateAuth(form){  
	  let privateKeys = []
	  let privateKey = await getPrivateKey(form.password, form.publicKey,form.chainName)
	  privateKeys.push(privateKey)
	  const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(form.chainName);
	  let api = new Api({ rpc, signatureProvider })
	  console.log("权限变更api",api)
	  let result = {}
    
	  for(let i = 0; i < form.requiredAuth.keys.length; i++){
	  	let value = form.requiredAuth.keys[i]
	  	form.requiredAuth.keys[i].key = convertLegacyPublicKey(value.key)
	  }
  
	  let updateauth_input = {
	    account: form.accountName,
	    permission: form.permission,
	    parent: form.permissionParent,
	    auth: form.requiredAuth
	  };
  
	  let action = {
	      account: "eosio",
	      name: "updateauth",
	  		data: updateauth_input,
	      authorization: [{
	  		  actor: form.accountName,
	  		permission: form.choosePermission
	      }]
	    }
    
	  console.log("adadadadad",JSON.stringify(action))
	  try {
	    result = await api.transact({
	      actions: [
	        action,
	      ]
	    }, {
	      blocksBehind: 3,
	      expireSeconds: 30,
	    });
	    if(!result){
	  	  return false
	    }
	  } catch (error) {
	    result = {}
	    console.log("权限变更失败: "+ error)
	    return false
	  }
  
	  api = ""
    privateKey = ""
    privateKeys = []
    // 账号创建结束
    return result	
  }  

  // 资源赎回，默认当前公链
  export async function undelegate(form) {
    console.log("开始赎回......")
    //获取当前公链
    let chain = await getCurrentChain()
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey, chain.ChainName)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(chain.ChainName);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[chain.ChainName][form.symbols],
            name: "undelegatebw",
            authorization: [{
                actor: form.account,
                permission: form.permission
            }],
            data: {
              from: form.account,
              receiver: form.receiver,
              unstake_net_quantity: form.netPrice + " " + form.symbols,
              unstake_cpu_quantity: form.cpuPrice + " " + form.symbols,
            }
          },
        ]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      if(!result) {
        result = {}
      }
    } catch (error) {
      result = {}
      console.log("资源抵押失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []

    return result
  }

 //购买内存，默认当前公链
  export async function buyRam(form) {
    console.log("开始买入内存......")
    //获取当前公链
    let chain = await getCurrentChain()
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey, chain.ChainName)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(chain.ChainName);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[chain.ChainName][form.symbols],
            name: "buyrambytes",
            authorization: [{
                actor: form.account,
                permission: form.permission
            }],
            data: {
              payer: form.account,
              receiver: form.receiver,
              bytes: parseInt(form.ramBytes)
            }
          },
        ]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      if(!result) {
        result = {}
      }
    } catch (error) {
      result = {}
      console.log("内存购买失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []

    return result
  }

  export async function sellRam(form) {
    console.log("开始卖内存......")
    //获取当前公链
    let chain = await getCurrentChain()
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey, chain.ChainName)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(chain.ChainName);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[chain.ChainName][form.symbols],
            name: "sellram",
            authorization: [{
                actor: form.account,
                permission: form.permission
            }],
            data: {
              account: form.account,
              bytes: parseInt(form.ramBytes)
            }
          },
        ]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      if(!result) {
        result = {}
      }
    } catch (error) {
      result = {}
      console.log("内存购买失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []

    return result
  }

