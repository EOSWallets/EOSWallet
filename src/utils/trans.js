const storage = weex.requireModule('storage');



// export function updateAssets(assets){
// 	console.log("添加缓存开始")
// 	storage.setItem("assets",  JSON.stringify(assets), res =>{
// 	    console.log("添加缓存 - OK") 
// 	})
// }

// export function getTransRecord(){
// 	return new Promise(function (resolve) {
// 	    try {
// 	        storage.getItem('trans_record', e => {
// 	            if (e.result === 'success') {
// 	                resolve(e.data);
// 	            } else {
// 	                resolve(false);
// 	                console.warn(`获取缓存key='${key}'失败,result=`, e);
// 	            }
// 	        });
// 	    } catch (e) {
// 	        console.error(`获取缓存key='${key}'出现异常！ >>>` + e.toString());
// 	        resolve(false);
// 	    }
// 	});
// }

//  export async function getTransrecordByName(accountName){
// 	let transRecord = JSON.parse(await getTransRecord())
// 	var accountTranRecord =eval('transRecord.'+accountName);
// 	return accountTranRecord
// }

//  export function getAllTransrecordByName(accountName){
// 	return new Promise(async function (resolve) {
// 		let transRecord = JSON.parse(await getTransRecord())
// 		var accountTranRecord =eval('transRecord.'+accountName);

// 		let allList = []
// 		for(var key in accountTranRecord){
// 			allList.push.apply(allList,accountTranRecord[key])
// 		}
// 		console.log("tranall",allList)

// 	    resolve(allList);
// 	});
// }

//  export async function getTypeTransrecordByName(accountName,type){
// 	 return new Promise(async function (resolve) {
// 	 	let transRecord = JSON.parse(await getTransRecord())
// 	 	var accountTranRecord =eval('transRecord.'+accountName);

// 	 	let value = eval('accountTranRecord.'+type);
// 	     resolve(value);
// 	 });


// }

// export function testaa(){
// 	console.log("添加缓存开始")
// 	let transRecord = {
// 	"xigui2222222": {
// 		"YAS":{
// 			"tranout": [{
// 					account_name: "xigui2222222",
// 					amount: "-0.0001 YAS",
// 					tran_date: "2020-08-04 00:00:00",
// 					remark: "transfer",
// 					icon:"tranout"
// 				},
// 				{
// 					account_name: "xigui2222222",
// 					amount: "-0.0002 YAS",
// 					tran_date: "2020-08-03 00:00:00",
// 					remark: "transfer",
// 					icon:"tranout"
// 				}
// 			],
// 			"tranin": [],
// 			"other": [],
// 		},
// 		"EDIOS":[]

// 	},
// 	"account1":{}
// }


// 	storage.setItem("trans_record",  JSON.stringify(transRecord), res =>{
// 	    console.log("添加缓存 - OK") 
// 	})
// }

export async function getTransrecords() {
return new Promise(function (resolve) {
	    try {
	        storage.getItem('trans_record', e => {
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

 export async function getTypeTransrecordByName(accountName,symbol,transType){
	 return new Promise(async function (resolve) {
	 	let transRecord = JSON.parse(await getTransrecords())
	 	let transList = []
		for(let i =0;i<transRecord.length;i++){
			if(transRecord[i].account_name == accountName && transRecord[i].symbol == symbol && transRecord[i].icon == transType){
				transList.push(transRecord[i])
			}
		}
		console.log("dadadadaaa",transList)
	     resolve(transList);
	 });
}

 export async function getTransrecordByName(accountName,symbol){
	 return new Promise(async function (resolve) {
	 	let transRecord = JSON.parse(await getTransrecords())
	 	let transList = []
		for(let i =0;i<transRecord.length;i++){
			if(transRecord[i].account_name == accountName && transRecord[i].symbol == symbol){
				transList.push(transRecord[i])
			}
		}
		console.log("dadadadaaa",transList)
	     resolve(transList);
	 });
}

export function testaa() {
	console.log("添加缓存开始")
	let transRecord = [{
			account_name: "xigui2222222",
			symbol: 'YAS',
			amount: "-0.0001 YAS",
			receiver: "xujy11223344",
			tran_date: "2020-08-04 00:00:00",
			remark: "transfer",
			trans_no: "1e12332324xsd",
			icon: "tranout"
		},
		{
			account_name: "xigui2222222",
			symbol: 'YAS',
			amount: "-0.0001 YAS",
			receiver: "xujy11223344",
			tran_date: "2020-08-04 00:00:00",
			remark: "transfer",
			trans_no: "1e12332324xsd",
			icon: "tranout"
		},
	]


	storage.setItem("trans_record", JSON.stringify(transRecord), res => {
		console.log("添加缓存 - OK")
	})
}

import { requestV2 } from './config_v2.js'
const marketApi = 'https://www.worldcoinindex.com/apiservice/v2getmarkets'
const marketKey = '81fynYZoXSEyZeZTlZ5SsKSOZJ92Ad'
export async function getMarket(chain) {
	let url = marketApi + "?key="+marketKey+"&fiat="+chain
	let params = {
		key: marketKey,
		fiat: chain
	}
	console.log(params)
	let res = await requestV2('get', url, params)
	console.log("获取到markets")
	console.log(res.data.Markets)
	console.log("***************")
	if(!res) {
		return res
	}
	return res.data.Markets[0]
}