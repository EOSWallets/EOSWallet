const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')
		
// export function updateAssets(assets){
// 	console.log("添加缓存开始")
// 	storage.setItem("assets",  JSON.stringify(assets), res =>{
// 	    console.log("添加缓存 - OK") 
// 	})
// }
function checkAccountName(name){
	if(name.indexOf('.') == -1){
		return name
	}
	name = name.replace(".","_")
	return name
}

export async function addAssets(assets,accountname, chainName){
	accountname = checkAccountName(accountname)
	let hasAssets = await getAssets(accountname,chainName);
	accountname = chainName + "_" + accountname
	console.log("addssets",assets)
	let newassets = []
	let asset = JSON.parse(await getAllAssets())
	
	let hasAssetList = []
	for(let i=0;i<hasAssets.length;i++){
		hasAssetList.push(hasAssets[i].name)
	}
	let key = accountname
	console.log("b")
	for(let i=0;i<assets.length;i++){
		if (assets[i].status == 1){
			let assetBalance = {
				name:assets[i].name,
				balance:0
			}
			if(hasAssetList.indexOf(assets[i].name) <0){
				hasAssets.push(assetBalance)
			}
	
		}
	}
	
	asset[key] = hasAssets
	newassets.push(asset)
	
	storage.setItem("assets",  JSON.stringify(asset), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export async function updateAssets(assetList,accountname,chainName){
	console.log("获取到跟新assets")
	console.log(assetList)
	accountname = checkAccountName(accountname)
	accountname = chainName + "_" + accountname
	let allAssets = JSON.parse(await getAllAssets())
	allAssets[accountname] = assetList
	storage.setItem("assets",  JSON.stringify(allAssets), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export async function delAssets(sympol,accountname, chainName){
	accountname = checkAccountName(accountname)
	let hasAssets = await getAssets(accountname, chainName);
		accountname = chainName + "_" + accountname
	
	console.log("detail",sympol,accountname)
	console.log("hasAssets",hasAssets)
	for(let i=0;i<hasAssets.length;i++){
		if(hasAssets[i].name == sympol){
			hasAssets.splice(i,1)
		}
	}
	
	let allAssets = JSON.parse(await getAllAssets())
	allAssets[accountname] = hasAssets
	
	storage.setItem("assets",  JSON.stringify(allAssets), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export function getAssets(accountname, chainName){
	accountname = checkAccountName(accountname)
	accountname = chainName + "_" + accountname
	console.log("getAssets ", accountname)
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("assets", async e => {
	            if (e.result === 'success') {
					let assets = JSON.parse(e.data)
					let asset = eval('assets.'+accountname)
					console.log("该账号所持代币：",asset)
					if (!asset || JSON.stringify(asset) == '{}'){
						// asset = ["YAS"]
						let asset = []
						asset.push({name:chainName,balance:0,unitPrice:0})
						let AllAssets = JSON.parse(await getAllAssets())
						AllAssets[accountname] = asset
						storage.setItem("assets",  JSON.stringify(AllAssets), res =>{
						    console.log("添加缓存 - OK") 
						})
						resolve(asset);
						return 
					}					
	                resolve(asset);
	            } else {
					console.log("没查到缓存") 
					// let asset = ["YAS"]					
					let asset = []
					asset.push({name:chainName,balance:0})
					let AllAssets = {}
					AllAssets[accountname] = asset
					storage.setItem("assets",  JSON.stringify(AllAssets), res =>{
					    console.log("添加缓存 - OK") 
					})
					resolve(asset);
	            }
	        });
	    } catch (e) {
	        console.error(`获取缓存key='${key}'出现异常！ >>>` + e.toString());
	        resolve(false);
	    }
	});
}

export function getAllAssets(){
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("assets", e => {
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


export async function addDbAssets(dbAssets,chainName){
	console.log("addDbAssets开始")
	let hasAssets = JSON.parse(await getAllDbAssets());

	hasAssets[chainName] = dbAssets
	console.log("addDbAssets内容",JSON.stringify(hasAssets))
	storage.setItem("dbassets",  JSON.stringify(hasAssets), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export async function getDbAssets(chainName){
	let hasAssets = JSON.parse(await getAllDbAssets())
	console.log("获取到hasAssets: "+ hasAssets)
	if(!hasAssets) {
		return {}
	} 
	let a = eval('hasAssets.'+chainName)
	console.log("取出的",a)
	return a
}



export function getAllDbAssets(){
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("dbassets", e => {
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


export function initDbAssets(){
	//本地所有资产列表
storage.getItem("dbassets", res =>{
    if(res.result == "failed"){
		let assets = require('./assetlist')
        let dbAssets = {
			YAS:assets.assetlist,
			TNT:[{
				
				    name:"TNT",
				    account:"eosio",
					imgUrl:"",
				    status:0,
				
			}],
			EOS:[
				{
					
					name:"EOS",
					account:"eosio",
					imgUrl:"",
					status:0,
					
				}
			]
		}
        storage.setItem("dbassets",  JSON.stringify(dbAssets), res =>{
            console.log("本地资产列表初始化 - OK") 
        })
        return
    }
})
}

