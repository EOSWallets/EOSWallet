const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')
		
// export function updateAssets(assets){
// 	console.log("添加缓存开始")
// 	storage.setItem("assets",  JSON.stringify(assets), res =>{
// 	    console.log("添加缓存 - OK") 
// 	})
// }

export async function addAssets(assets,accountname){
	let hasAssets = await getAssets(accountname);
	accountname = "a" + accountname
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

export async function updateAssets(assetList,accountname){
	accountname = "a" + accountname
	let allAssets = JSON.parse(await getAllAssets())
	allAssets[accountname] = assetList
	storage.setItem("assets",  JSON.stringify(allAssets), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export async function delAssets(sympol,accountname){
	let hasAssets = await getAssets(accountname);
		accountname = "a" + accountname
	
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
	accountname = chainName + "_" + accountname
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("assets", async e => {
	            if (e.result === 'success') {
					let assets = JSON.parse(e.data)
					let asset = eval('assets.'+accountname)
					console.log("该账号所持代币：",asset)
					if (!asset){
						asset = [{name:"YAS",balance:0}]
						let AllAssets = JSON.parse(await getAllAssets())
						AllAssets[accountname] = asset
						storage.setItem("assets",  JSON.stringify(AllAssets), res =>{
						    console.log("添加缓存assets - OK") 
						})
						resolve(asset);
						return 
					}					
	                resolve(asset);
	            } else {
					console.log("没查到缓存") 
					// let asset = ["YAS"]					
					let asset = []
					asset.push(chainName)
					let AllAssets = {}
					asset = [{name:"YAS",balance:0}]
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



export function addDbAssets(dbAssets){
	storage.setItem("dbassets",  JSON.stringify(dbAssets), res =>{
	    console.log("添加缓存 - OK") 
	})
}

export function getDbAssets(){
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
