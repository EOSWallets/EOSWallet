const storage = weex.requireModule('storage');

export function setLan(lan){	
	storage.setItem("lan",  lan, res =>{
	    console.log("添加缓存 - OK") 
	})
	
}


export function getLan(){
	return new Promise(function (resolve) {
	    try {
	        storage.getItem("lan", e => {
	            if (e.result === 'success') {
	                resolve(e.data);
	            } else {
					storage.setItem("lan",  "zh-CN", res =>{
					    console.log("添加缓存 - OK") 
					})
	                resolve('zh-CN');
	                console.warn(`获取缓存key='${key}'失败,result=`, e);
	            }
	        });
	    } catch (e) {
	        console.error(`获取缓存key='${key}'出现异常！ >>>` + e.toString());
	        resolve(false);
	    }
	});
}