import { getCurrentChain } from './chain';

const { JsonRpc } = require('eosjs');
const storage = weex.requireModule('storage')

export const ContractAccounts = {
	TNT:{
		"TNT": "eosio.token",
	},
	YAS:{
		"YAS": "eosio.token",
		"YDAP": "ydaocontract",
		"AEIDOS": "veidoscoin.x",
		"AIDOS": "aidosonecoin",
		"ANTIEOS": "veostoken.x",
		"ANTIUSD": "vusdtoken.x",
		"BOS": "bosibc.io",
		"BOSLP": "bosmpacoin.x",
		"BTCLP": "mptokens.x",
		"CCC": "ciacoincandy",
		"CCCLP": "mptokens.x",
		"COM": "comtoken.x",
		"COMLP": "ammtokens.x",
		"CPM": "cpmcoi",
		"DEMO": "myrexairdrop",
		"EIDOSLP": "ammtokens.x",
		"EOS": "bosibc.io",
		"EOSAT": "eosmptoken.x",
		"EOSBEAR": "eoscoin.x",
		"EOSBULL": "eoscoin.x",
		"EOSLP": "eosmpacoi",
		"EOSLP": "mptokens.x",
		"EOSLP": "coins.ex",
		"EOSLP": "ammtokens.x",
		"EOSV": "eosvtoke",
		"FOB": "fobtokencode",
		"FOBLP": "ammtokens.x",
		"GOLDLP": "mptokens.x",
		"HN": "hashnumcoins",
		"IBCC": "ibcccontract",
		"IBT": "ibt.com",
		"IO": "token.io",
		"MINER": "minersminers",
		"MPALP": "mpalpcoin.ex",
		"ORC": "rexclaimcoin",
		"ORCLP": "corcpool.x",
		"ORCLP": "cammtokens.x",
		"PLUS": "pluspluscoin",
		"PLUSLP": "pluspooLx",
		"RMBLP": "mptokens.x",
		"SET": "setcontracts",
		"USDAT": "usdmptoken.x",
		"USDLP": "banktokens.x",
		"USDLP": "coins.x",
		"USDLP": "usdmpacoin.x",
		"USDLP": "mptokens.x",
		"USDT": "bosibc.io",
		"USDTLP": "ammtokens.x",
		"USDV": "usdmptoken.x",
		"UTC": "utc.t",
		"VAMT": "mpatoken.x",
		"VEIDOS": "veidoscoin.x",
		"VEOS": "veostoken.x",
		"VOICE": "voiceyascode",
		"VUSD": "vusdtoken.x",
		"YASAMM": "yasammcoin.x",
		"YASLP": "mptokens.x",
		"YASLP": "yasmptoken.x",
		"YASLP": "yaslpcoin.ex",
		"YASLP": "yaspool.x",
		"YASV": "yasmptoken.x",
		"YDAOLP": "ydaopool.x",
	},
	EOS:{
		"EOS":"eosio.token"
	}
}

export const ContractAccounts2 = {
	TNT:{
		"TNT": "eosio",
	},
	YAS:{
		"YAS": "eosio"
	},
	EOS:{
		"EOS":"eosio.token"
	}
}
const stream = weex.requireModule('stream');
// export const rpc = new JsonRpc('https://yas.maiziqianbao.net'); //废弃
export   const  getRpc = async (chainName)=>{
	let ChainManager = JSON.parse(await getChainManager())
	let rpc;
	if(chainName == ''){
		rpc = new JsonRpc(ChainManager[ChainManager.CurrentChain].CurrentNode);
		return rpc
	}
	rpc = new JsonRpc(ChainManager[chainName].CurrentNode);

	//获取当前公链的节点
	// storage.getItem("ChainManager", async res =>{
	// 	let ChainManager = JSON.parse(res.data);
	// 	return new JsonRpc(ChainManager[ChainManager.CurrentChain].CurrentNode);
	// })  
	// let ChainManager = JSON.parse(await getChainManager())
	// let rpc = new JsonRpc(ChainManager[ChainManager.CurrentChain].CurrentNode);
	// console.log("rpc节点2:",rpc)
	return rpc
}
function getChainManager(){
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("ChainManager", e => {
	            if (e.result === 'success') {
	                resolve(e.data);
	            } else {
	                resolve(false);
	                console.warn(`获取缓存key='${key}'失败,result=`, e);
	            }
	        });
	    } catch (e) {
	        console.error(`获取缓存key='${key}'出现异常！ >>>` + e.toString());
	        resolve(false);
	    }
	});

}

//暂且固定，不随公联变动
// export const abiBinToJsonUrl = "https://yas.maiziqianbao.net/v1/chain/abi_bin_to_json"
export const abiBinToJsonUrl = "http://openapi.eos.ren/v1/chain/abi_bin_to_json"
export const AESKey = "8S2JThYld1FUJvYixqfls63cLHK2Kxm6"

export const cpuPrice = 0.0004
export const netPrice = 0.0002

export const chainList = ["TNT","YAS","EOS"]

export function request(method, url, params, chainName) {
    return new Promise((resolve, reject) => {		
	  storage.getItem("ChainManager", async res =>{
		  console.log(res)
	  	let ChainManager = JSON.parse(res.data);
		  let basicUrl = ChainManager[chainName].CurrentNode + "/v1/";
		  console.log("发起请求 ", basicUrl+url)
		  console.log("请求参数： ", JSON.stringify(params))
		  stream.fetch({
			method,
			url: basicUrl+url,
			headers: {
			  'Content-Type': 'application/json;charset=UTF-8',
			   Accept: 'application/json, text/plain, */*',
			   Authorization: 'token',
			},
			body: method === 'get' ? '' : JSON.stringify(params),
			type: 'json',
		  }, (res) => {
			  console.log("得到返回:",res)
			 if (res.ok) {
				  resolve(res);
			 } else {
				  resolve(false)
			 }
		 	}, () => {
			  // complete
		  });
	  })  
    });
}


export function getStorage(key) {
    return new Promise(function (resolve) {
      const storage = weex.requireModule('storage');
      try {
          storage.getItem(key, e => {
              if (e.result === 'success') {
                  resolve(e.data);
                  console.info(`获取缓存key='${key}'成功,result=`, e);
              } else {
                  resolve(false);
                  console.warn(`获取缓存key='${key}'失败,result=`, e);
              }
          });
      } catch (e) {
          console.error(`获取缓存key='${key}'出现异常！ >>>` + e.toString());
          resolve(false);
      }
  });
}

export const imgSrc = "local:///"


export const api = "http://192.168.1.12:8000"


export function requestV2(method, url, params) {
    return new Promise((resolve, reject) => {
      stream.fetch({
        method,
        url: url,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
           Accept: 'application/json, text/plain, */*',
           Authorization: 'token',
        },
        body: method === 'get' ? '' : JSON.stringify(params),
        type: 'json',
      }, (res) => {
         if (res.ok) {
              resolve(res);
         } else {
              resolve(false)
         }
     }, () => {
          // complete
       });
    });
}

export async function getCurrentVersion(type) {
	let version = await getStorage(type+'_version')
	let url = api+ "/v1/admin_api/version/get_version?type="+type
	let res = await requestV2('get', url, {})
	if(!res) {
	  return true
	}

	let currVersion = res.data.data
	console.log("获取到当前版本号")
	console.log(res)
	storage.setItem(type+'_version', currVersion)
	if(!version || parseInt(version) != currVersion) {
	  console.log("不需要更新")
	  return true
	}

	return false
  }
