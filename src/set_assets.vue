<template>
	<div class="main" ref="authorityMain">
		<div class="navigator">
			<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF;" >{{zhLan.set_assets}}</text>
			<image src="" style="height: 60px;width: 60px" ></image>
			<!-- <image :src="`${imgSrc}add`" style="height: 60px;width: 60px" @click="andNet"></image> -->
		</div>
		<list class="body-list" style="height: 1388px;">
			<!-- <scroller :style="scrollerStyle"> -->
				<cell v-for="(item,index) in assetList" :key="index">
					<div class="list-all" @click="choose(index)" :style="item.status == 1?assetStyleChoosed:assetStyle">
						<div class="list-left"><image :src="`${imgSrc}yas`" style="width: 70px;height: 70px;margin-left: 25px;margin-top: 30px;"></image></div>
						<div class="list-center">
							<text class="list-center-top">{{item.name}}  </text>
							<text class="list-center-bottom">{{item.account}}</text>
						</div>
						<div class="list-right" v-if="item.status == 1"><image :src="`${imgSrc}success`" style="width: 40px;height: 40px;margin-left: 0px;margin-top: 40px;"></image></div>
					</div>
				</cell>
			<!-- </scroller> -->
			
			
		</list>
		
		<wxc-mask height="450"
		              width="580"
		              border-radius="20"
		              duration="200"
		              mask-bg-color="#FFFFFF"
		              :has-animation="true"
		              :has-overlay="true"
					  :overlay-can-close="false"
		              :show-close="false"
		              :show="show"
		              @wxcMaskSetHidden="wxcMaskSetHidden">
		      <div class="add-content">
				<div class="add-close"><image @click="quit" src="static/close.png" style="width: 45px;height: 45px;margin-left: 520px;"></image></div>
				<text class="add-title">{{zhLan.add_asset}}</text>
				<div class="add-input">
					<text class="input-title">{{zhLan.symbol}}</text>
					<div><input type="text" :value="net_name" :placeholder="zhLan.like_yas"></div>
				</div>
				<div class="add-input">
					<text class="input-title">{{zhLan.contract_account}}</text>
					<div><input type="text" :value="net_url" :placeholder="zhLan.like_eos"></div>
				</div>
				<div class="add-button">
					<wxc-button :text="zhLan.add" type="green" size="medium" @wxcButtonClicked="commit"></wxc-button>
				</div>
		      </div>
		    </wxc-mask>
			
	</div>
</template>

<script>
	import {
		WxcMinibar,
		WxcMask,
		WxcButton,
		Utils
	} from 'weex-ui';
	import {assetlist} from './utils/assetlist_v2'
	import {getStorage,imgSrc} from './utils/config_v2';
	import {addAssets,delAssets,getAssets,addDbAssets,getDbAssets} from './utils/asset_v2'
	const animation = weex.requireModule('animation')
	const modal = weex.requireModule('modal')
    const navigator = weex.requireModule('navigator')
	const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')	
	const stream = weex.requireModule('stream')
	export default {
		components: {
			WxcMinibar,
			WxcMask,
			WxcButton 
		},
		data: () => ({
			show: false,
			net_name:"",
			net_url:"",
			assetList:[],
			scrollerH:"",
			imgSrc:imgSrc,
			assetStyle : {
				"border-width": "1px",
				"border-color": "#c1c1c1",
				"border-style": "solid"				
			},
			assetStyleChoosed : {
				"border-width": "4px",
				"border-color": "#1E90FF",
				"border-style": "solid"
			},
			account:{},
			dbAssets:[],
			currentChain:"",
			chain:{},
			zhLan: {},
            globalLan: globalLan,
			serverAddr:"http://xgserver1.utools.club"
		}),
		beforeCreate() {
		    const tabPageHeight = Utils.env.getPageHeight();
		    console.log("获取到高度"+tabPageHeight)
		    this.scrollerH = (tabPageHeight) +'px'
		    this.scrollerStyle = {
		        height:this.scrollerH
		    }
		},
		async mounted() {	
			let lan = await getStorage('lan')
			if(!lan) {
				lan = 'zh-CN'
			}
			this.zhLan = this.globalLan.lang("set_assets", lan)
		},
		async created() {

			console.log("创建开始")
			this.chain = JSON.parse(await getStorage("ChainManager"));
			console.log("当前公链",this.chain)
			this.assetList = await getDbAssets(this.chain.CurrentChain);
			console.log("server的资产",this.assetList)
			this.account = JSON.parse(await getStorage("Account"));
			let hasAssets = await getAssets(this.account.account_name,this.chain.CurrentChain);
			console.log("存在的资产",hasAssets)
			let pureHasAssets = []
			for(let i=0;i<hasAssets.length;i++){
				pureHasAssets.push(hasAssets[i].name)
			}
			
			console.log("jielun",pureHasAssets)

			for(let i=0;i<this.assetList.length;i++){
				let asset = this.assetList[i]
				if (pureHasAssets.indexOf(asset.name) != -1 ){
					this.assetList[i].status =1
				}else{
					this.assetList[i].status =0
				}
			}
			let chainManager = JSON.parse(await getStorage("ChainManager"))
			this.currentChain = chainManager.CurrentChain
			
			this.getDBAssets()
		},
		methods: {
			async getDBAssets(){
				// await axios.get('http://127.0.0.1:8000/v1/admin_api/token/find?state=1')
				//       .then(res =>  {
				// 		  console.log("或缺的",res.data.data)
				// 		if(res.data.code == 0){
				// 			console.log("或缺的",res.data.data)
				// 			this.dbAssets = res.data.data
				// 			if(this.dbAssets.length != this.assetList.length){
				// 			let newDbAssets = []
				// 				for(let i = 0;i<this.dbAssets.length;i++){
				// 					let newDbAsset = {
				// 						name:this.dbAssets[i].symbol,
				// 						account:this.dbAssets[i].code,
				// 						imgUrl:"",
				// 						status:0,
				// 					}
				// 					// if(newDbAsset.name == this.currentChain){
				// 					// 	newDbAsset.status = 1
				// 					// }
				// 					newDbAssets.push(newDbAsset)
				// 					newDbAssets.sort()
				// 				}
				// 				this.assetList = newDbAssets
				// 			    addDbAssets(this.assetList,this.chain.CurrentChain)
				// 				console.log("替换",this.assetList)
				// 			}
				// 		}
				// 	  })
				//       .catch(function (error) { // 请求失败处理
				//         console.log("后台失败",error);
				//       });
				let that = this
				let url = this.serverAddr + '/v1/admin_api/token/find?state=1&pub_chain=' + this.chain.CurrentChain
				console.log("地址:",url)
				stream.fetch({
				    method: 'GET',
				    url: url,
				    type:'json'
				  }, function(res) {
				    if(!res.ok){
						console.log("网络错误")
				    }else{
						console.log("连接成功")
						that.dbAssets = res.data.data
						if(that.dbAssets.length != that.assetList.length){
						let newDbAssets = []
							for(let i = 0;i<that.dbAssets.length;i++){
								let newDbAsset = {
									name:that.dbAssets[i].symbol,
									account:that.dbAssets[i].code,
									imgUrl:"",
									status:0,
								}
								newDbAssets.push(newDbAsset)
								newDbAssets.sort()
							}
							that.assetList = newDbAssets
							console.log("替换",JSON.stringify(that.assetList))
						    addDbAssets(that.assetList,that.chain.CurrentChain)
							
						}
				    }
				  });
				console.log("后台",this.dbAssets)
			},
			getId(index){
				return "asset"+index
			},
			async choose(index){
				console.log(index)
				console.log(this.assetList[index])
				if (this.assetList[index].status == 0){
					console.log("添加代币")
					this.assetList[index].status = 1
					await addAssets(this.assetList,this.account.account_name, this.chain.CurrentChain)
					// this.assetListStyle[index].border = "8px solid #797979"
					return
				}else{				
					console.log("删除代币")	
					await delAssets(this.assetList[index].name,this.account.account_name, this.chain.CurrentChain)
					this.assetList[index].status = 0
					this.assetListStyle[index].border = "2px solid #c1c1c1"
					// let a = document.getElementsByClassName("list-all")[index]
					// a.setAttribute("style","box-shadow: 0px 0px 0px 0px rgba(214, 216, 207, 0.5)")
					return
				}
			},
			goBack() {
				console.log("创建账号点击返回")
			    const assetsSet = new BroadcastChannel('assets_refresh')
        		assetsSet.postMessage('refresh')
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},
			andNet(){
				this.show = true;
			},
			wxcMaskSetHidden () {
			  
			},
			quit(){
				this.show = false;
			},
			commit(){
				console.log(this.net_name)
				console.log(this.net_url)
			},
			longpress(e){
				console.log(e)
			}
		}
	};
</script>

<style scoped>
.main{
	/* max-height: 2000px; */
	opacity: 1;
}
.navigator{
	border-bottom-width: 1px;
	    border-bottom-color: #C0C0C0;
	    border-bottom-style: solid;
	    background-color: #ffffff;
	    width: 750px;
	    height: 120px;
	    flex-direction: row;
	    justify-content: space-between;
	    align-items: center;
	        padding: 0 20px;
	    /* position: absolute; */
	    top: 0;
}
.body-list{
	margin-top: 10px;
}
.list-all{
	height: 130px;
	margin-left: 15px;
	width: 720px;
	border: 2px solid #c1c1c1;
	border-radius: 10px;
	margin-bottom: 16px;
	background-color: #FFFFFF;
	flex-direction: row;
	/* box-shadow: 0px 2px 2px 2px rgba(214, 216, 207, 0.5) */
}
.list-left{
	width: 120px;
	
}
.list-center{
	width: 540px;
}
.list-center-top{
	margin-top: 30px;
	font-size: 36px;
}
.list-center-bottom{
	font-size: 28px;
	color: #8d8d8d;
}
.add-title{
	font-size: 36px;
	color: #00EE83;
	margin-left: 180px;
}
.add-input{
	margin-top: 50px;
	flex-direction: row;
}
.input-title{
	width: 142.5px;
	font-size: 32px;
	margin-left: 40px;
}
.add-input input{
	width: 380px;
	border-bottom: 0.5px solid #c6c6c6;
	font-size: 36px
}
.add-button{
	margin-top: 50px;
	margin-left: 180px;
	margin-right: auto;
}
</style>
