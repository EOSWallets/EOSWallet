import { request } from './config'
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const {convertLegacyPublicKey} = require('eosjs/dist/eosjs-numeric')
const modal = weex.requireModule('modal');
import {
  getPrivateKey
} from './account'
import {
  ContractAccounts,
  ContractAccounts2,
  rpc,
  cpuPrice,
  netPrice
} from './config'

// const fetch = require('node-fetch');                   
const { TextEncoder, TextDecoder } = require('text-encoding'); 

//发起交易
export async function transfer(from, to, symbols, quantity, memo, publicKey, permission, password){
  console.log("发起交易......")
  //生成 api 
  let privateKeys = []
  let privateKey = await getPrivateKey(password, publicKey)
  console.log('私钥为：'+privateKey)
  privateKeys.push(privateKey)
  console.log(privateKeys[0])
  const signatureProvider = new JsSignatureProvider(privateKeys);
  let api = new Api({ rpc, signatureProvider,textDecoder: new TextDecoder(), textEncoder: new TextEncoder()})
  console.log(api)
  //发起交易
  console.log("开始交易")
  let result = {}
  try {
    result = await api.transact({
      actions: [{
        account: ContractAccounts[symbols],
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

export async function getActionHistory(accountName){
  const rpc2 = new JsonRpc('https://rpc.yas.plus');
  let res = await rpc2.history_get_actions(accountName, -1, -10000)
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

  //取得账户代币余额
  export async function getCurrencyBalance(account, symbols) {
    let currentBalance = "null"
    let contractAccount = ContractAccounts[symbols]
    if (!contractAccount) {
      return
    }
    let params = {
      code: contractAccount,
      account: account,
      symbol: symbols
    }
    let result = []
    let url = "chain/get_currency_balance"
    let res = await request('post', url, params)
    console.log("***************")
    console.log(res)
    console.log("****************")
    // console.log("返回了啊啊啊")
	if(res.data.length == 0){
		return 0
	}
    currentBalance = res.data[0].replace(symbols, "")
    return currentBalance
  }
  
  /*取得账户资源余额
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
      let resource = {
          accountInfo : {},
          cpu : {},
          net : {},
          ram : {},
          // staked : ""
          receiveAccounts: []
      }
      let accountInfo = {}
      let url = 'chain/get_account'
      let params = {
          account_name: account
      }
      let res = await request('post', url, params)
      console.log("获取到结果")
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
        console.log("############")
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
        code: "eosio",
        scope: account,
        table: "delband",
        limit: 10000,
        lower_bound: 0,
        uppper_bound: -1
      }
    
      // let receiveAccounts = await eosApi.getTableRows(params)

      // let params = {
      //   code: contractAccount,
      //   account: account,
      //   symbol: symbols
      // }
 
      url = "chain/get_table_rows"
      res = await request('post', url, params)
      console.log("***************")
      console.log(res)
      console.log("****************")
      // console.log("返回了啊啊啊")
      if(!res) {
        return
      }
      let receiveAccounts = res.data
      console.log("receiveAccounts: ", receiveAccounts)

      resource.receiveAccounts = receiveAccounts

      return resource
  }

  // 获取为他人抵押的账号
  export async function getDelegatedToOther(account){
    let limit = 1000;
    let params = {
      json: true,
      code: ContractAccounts[symbols],
      scope: account,
      table: "delband",
      limit: limit,
      lower_bound: 0,
      uppper_bound: -1
    }
  
    // let receiveAccounts = await eosApi.getTableRows(params);
    let url = "chain/get_table_rows"
    let res = await request('post', url, params)
    console.log("***************")
    console.log(res)
    console.log("****************")
    // console.log("返回了啊啊啊")
    if(!res) {
      return
    }
    receiveAccounts = res.data
    while(receiveAccounts.more){
      params.limit += 1000;
      //receiveAccounts = await eosApi.getTableRows(params);
      let res = await request('post', url, params)
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
  export async function createNewAccount(form) {
    console.log("开始创建账号......")
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let api = new Api({ rpc, signatureProvider })
    console.log("##################")
    console.log(api)
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[form.symbols],
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
            account: ContractAccounts2[form.symbols],
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
            account: ContractAccounts2[form.symbols],
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
      if(!result) {
        result = {}
      }
    } catch (error) {
      result = {}
      console.log("创建账号失败: "+ error)
    }

    api = ""
    privateKey = ""
    privateKeys = []
    // 账号创建结束
    return result
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
    // let res = await eosApi.getTableRows(params)

    let url = "chain/get_table_rows"
    let result = await request('post', url, params)
    console.log("***************")
    console.log(result)
    console.log("****************")
    if(!result) {
      return
    }
    let res = result.data
    console.log("ram价格："+JSON.stringify(res))
    console.log("res.rows[0].quote.balance: " +res.rows[0].quote.balance)
    let quoteBalance = parseFloat(res.rows[0].quote.balance.substring(0, res.rows[0].quote.balance.length-4))
    let baseBalance = parseFloat(res.rows[0].base.balance.substring(0, res.rows[0].base.balance.length-4))
    console.log("quote: "+baseBalance)
    let price = (ram * quoteBalance) / (ram + baseBalance / 1024)
    
    console.log("最终价格为"+ Math.round(price*1000)/1000)
    return Math.round(price*10000)/10000
  }

  // export async function getCPUPrice(ram) {
  //   let res = await eosApi.getAccount("xujy12341234")
  //   console.log("ram价格："+JSON.stringify(res))
  //   var cpuStaked = res.total_resources.cpu_weight.substring(0,res.total_resources.cpu_weight.indexOf(' '));
  //   var cpuAvailable = res.cpu_limit.max / 1000; // convert microseconds to milliseconds
  //   let cpuPriceEos = ((6 / cpuAvailable)/3).toFixed(8); //~ divide by 3 to get average per day from 3 day avg
  //   console.log(cpuStaked);
  //   console.log(cpuAvailable);
  //   console.log(cpuPriceEos);
  //   // return Math.round(price, 4)
  // }


  // 资源抵押
  export async function delegate(form) {
    console.log("开始新增抵押......")
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[form.symbols],
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
	let privateKey = await getPrivateKey(form.password, form.publicKey)
	privateKeys.push(privateKey)
	const signatureProvider = new JsSignatureProvider(privateKeys);
	
	let api = new Api({ rpc, signatureProvider })
	let result = {}
	
	for(let i=0;i<form.requiredAuth.keys.length;i++){
		let value = form.requiredAuth.keys[i]
		form.requiredAuth.keys[i].key = convertLegacyPublicKey(value.key)
	}
	
	let updateauth_input = {
	  account: form.accountName,
	  // permission: 'active',
	  // parent: 'owner',
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
	  
	  // if (result == false){
		 //  modal.alert({
		 //    message: '权限变更失败',
		 //    okTitle: '确认'
		 //  }, function () {
		 //  })
	  // }
	  if(!result){
		  return false
	  }
	} catch (error) {
	  result = {}
	  console.log("权限变更失败: "+ error)
	  // modal.alert({
	  //   message: '权限变更失败'+ error,
	  //   okTitle: '确认'
	  // }, function () {
	  // })
	  return false
	}
	
	api = ""
	privateKey = ""
	privateKeys = []
	// 账号创建结束
	return result	
  }
  
  
  
  export async function test(){ 
	  
	  
	  
	  
	  
	  
	  
	  //console.log(convertLegacyPublicKey("EOS6jciBbUrRtbf32hZtvD8f9crXhbKwdEvv4o1Z3vRUYz56k5SE3"))
  	let privateKeys = []
  	let privateKey = await getPrivateKey("xg123456", "EOS7PCbHMmhxvSajr95558sFxWmtVR4K4erXutPfjk9x4xygsgrwS")
  	privateKeys.push(privateKey)
	let privateKey1 = await getPrivateKey("xg123456", "EOS6jciBbUrRtbf32hZtvD8f9crXhbKwdEvv4o1Z3vRUYz56k5SE3")
  	privateKeys.push(privateKey1)
	
	
  	const signatureProvider = new JsSignatureProvider(privateKeys);
  	
  	let api = new Api({ rpc, signatureProvider })
  	let result = {}
  	
  	
  	let action = {
		"account": "eosio",
		"name": "updateauth",
		"data": {
			"account": "xigui2222222",
			"permission": "owner",
			"parent": "",
			"auth": {
				"threshold": 1,
				"keys": [{
					"key": "EOS4vDaXcUFFv9Bt1fF3S124zqeNmbnS41xPfALYjqqgbMmDCE5yj",
					"weight": 1
				}],
				"accounts": [],
				"waits": []
			}
		},
		"authorization": [{
			"actor": "xigui2222222",
			"permission": "owner"
		}]
		}


let a =  {
		"delay_sec": 0,
		"max_cpu_usage_ms": 0,
  	    actions: [
  	      action,
  	    ],
  	  }
	
	// const rpc2 = new JsonRpc('https://rpc.yas.plus');
	
	// let res = rpc2.push_transaction(a)
	// console.log("result:",res)
	
	console.log("yangli",JSON.stringify(a))
  	try {
  	  result = await api.transact(
	 a, {
  	    blocksBehind: 3,
  	    expireSeconds: 30
  	  },
	  
	  );
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
    


  // 资源抵押
  export async function undelegate(form) {
    console.log("开始赎回......")
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[form.symbols],
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

    // 资源抵押
  export async function buyRam(form) {
    console.log("开始买入内存......")
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[form.symbols],
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
    //生成 api 
    let privateKeys = []
    let privateKey = await getPrivateKey(form.password, form.publicKey)
    privateKeys.push(privateKey)
    const signatureProvider = new JsSignatureProvider(privateKeys);
    let api = new Api({ rpc, signatureProvider })
    //发起交易
    let result = {}
    try {
      result = await api.transact({
        actions: [
          {
            account: ContractAccounts2[form.symbols],
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


