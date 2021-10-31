
const { JsonRpc } = require('eosjs');

export const ContractAccounts = {
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
}

export const ContractAccounts2 = {
    "YAS": "eosio",
}
const stream = weex.requireModule('stream');
export const rpc = new JsonRpc('https://yas.maiziqianbao.net');
export const abiBinToJsonUrl = "https://yas.maiziqianbao.net/v1/chain/abi_bin_to_json"
export const AESKey = "8S2JThYld1FUJvYixqfls63cLHK2Kxm6"

export const cpuPrice = 0.0004
export const netPrice = 0.0002

const basicUrl = 'https://yas.maiziqianbao.net/v1/'

export function request(method, url, params) {
    return new Promise((resolve, reject) => {
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
// export const imgSrc = "static/"
