<template>
	<div class="main" ref="authorityMain" style="opacity: 1;">
		
		<div class="navigator">
			<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF;" >{{asset.name}}</text>
			<image src="" style="height: 60px;width: 60px"></image>
		</div>
		
		<!-- <div class="navigator">
			<wxc-minibar background-color="#FFFFFF" @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
			 @wxcMinibarRightButtonClicked="minibarRightButtonClick">
				<text style="font-size: 36px; color: #1E90FF" slot="middle">{{name}}</text>
				<image slot="right" :src="`${imgSrc}navigation`" style="height: 40px;width: 40px"></image>
			</wxc-minibar>
		</div> -->
		
		<div class="coin-detail">
			<div style="flex-direction: row;">
				<div class="coin-img">
					<image :src="`${imgSrc}yas`" slot="left" style="height: 80px;width: 80px;margin-left: 16px;margin-top: 18px;"></image>
				</div>
				<div class="coin-title">
					<text class="coin-name">{{asset.name}}</text>
					<text class="coin-account">{{asset.account}}</text>
				</div>
			</div>
			
			<text class="coin-balance">{{asset_balance}}</text>
		</div>
		
		<div class="handle">
			<div class="trans-out" @click="jumpTransout">
				<div class="handle-title">
					<div class="handle-image"><image :src="`${imgSrc}transout`" style="height: 35px;width: 35px;margin-top:32.5px ;margin-right: 10px;"></image></div>
					<text class="handle-name">{{zhLan.tranout}}</text>
				</div>
			</div>
			<text class='fenge'>|</text>
			<div class="trans-in" @click="jumpTransin">
				<div class="handle-title">
					<div class="handle-image"><image :src="`${imgSrc}transin`"  style="height: 35px;width: 35px;margin-top:32.5px ;margin-right: 10px;"></image></div>
					<text class="handle-name">{{zhLan.tranin}}</text>
				</div>
			</div>
		</div>
		<div class="handle-results">
			<wxc-tab-page ref="wxc-tab-page"
			                :tab-titles="tabTitles"
							:tab-styles="tabStyles"
			                title-type="text"
			                
			               
			                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
				
				<div class="data-show">
					<scroller :style="scrollerStyle" v-if="allTrans.length > 0">
					<div v-for="(item,index) in allTrans" :key="index" class="table-list" @click="goDetail(item)" >
						<div class="tran-icon">
							<image :src="item.action_trace.act.data.from == account.account_name ?`${imgSrc}tranout`:`${imgSrc}tranin`" slot="left" style="height: 50px;width: 50px;margin: 22.5px; margin-top: 40px;"></image>
						</div>
						<div class="tran-detail">
							<text class="tran-name">{{item.action_trace.act.data.from}}</text>
							<text class="tran-time">{{item.action_trace.block_time}}</text>
						</div>
						<div class="tran-amount">
							<text class="tran-count">{{item.action_trace.act.data.from == account.account_name ? '- ' : '+ '}}{{item.action_trace.act.data.quantity}}</text>
							<text class="tran-type">{{item.action_trace.act.data.memo}}</text>
						</div>
					</div>
					</scroller>
					<text v-if="allTrans.length == 0" style="margin-left: 320px;margin-top: 15px;font-size: 32px;color: #bdbdbd;"  @click="test">{{zhLan.nodatas}}</text>
					
				</div>
				
				
				<div class="data-show">
					<scroller :style="scrollerStyle" v-if="outTrans.length > 0">
					<div v-for="(item,index) in outTrans" :key="index" class="table-list" @click="goDetail(item)">
						<div class="tran-icon">
							<image :src="`${imgSrc}tranout`" slot="left" style="height: 50px;width: 50px;margin: 22.5px; margin-top: 40px;"></image>
						</div>
						<div class="tran-detail">
							<text class="tran-name">{{item.action_trace.act.data.from}}</text>
							<text class="tran-time">{{item.action_trace.block_time}}</text>
						</div>
						<div class="tran-amount">
							<text class="tran-count">- {{item.action_trace.act.data.quantity}}</text>
							<text class="tran-type">{{item.action_trace.act.data.memo}}</text>
						</div>
					</div>
					</scroller>
					<text v-if="outTrans.length == 0" style="margin-left: 320px;margin-top: 15px;font-size: 32px;color: #bdbdbd;">{{zhLan.nodatas}}</text>
				</div>
				
				<div class="data-show">
					<scroller :style="scrollerStyle" v-if="inTrans.length > 0">
					<div v-for="(item,index) in inTrans" :key="index" class="table-list" v-if="inTrans.length > 0" @click="goDetail(item)">
						<div class="tran-icon">
							<image :src="`${imgSrc}tranin`" slot="left" style="height: 50px;width: 50px;margin: 22.5px; margin-top: 40px;"></image>
						</div>
						<div class="tran-detail">
							<text class="tran-name">{{item.action_trace.act.data.from}}</text>
							<text class="tran-time">{{item.action_trace.block_time}}</text>
						</div>
						<div class="tran-amount">
							<text class="tran-count">+ {{item.action_trace.act.data.quantity}}</text>
							<text class="tran-type">{{item.action_trace.act.data.memo}}</text>
						</div>
					</div>
					</scroller>
					<text v-if="inTrans.length == 0" style="margin-left: 320px;margin-top: 15px;font-size: 32px;color: #bdbdbd;">{{zhLan.nodatas}}</text>
				</div>
				<div class="data-show">
					<scroller :style="scrollerStyle" v-if="otherTrans.length > 0">
					<div v-for="(item,index) in otherTrans" :key="index" class="table-list" v-if="otherTrans.length > 0" @click="goDetail(item)">
						<div class="tran-icon">
							<image :src="`${imgSrc}${item.icon}`" slot="left" style="height: 50px;width: 50px;margin: 22.5px; margin-top: 40px;"></image>
						</div>
						<div class="tran-detail">
							<text class="tran-name">{{item.account_name}}</text>
							<text class="tran-time">{{item.tran_date}}</text>
						</div>
						<div class="tran-amount">
							<text class="tran-count">{{item.amount}}</text>
							<text class="tran-type">{{item.remark}}</text>
						</div>
					</div>
					</scroller>
					<text v-if="otherTrans.length == 0" style="margin-left: 320px;margin-top: 15px;font-size: 32px;color: #bdbdbd;">{{zhLan.nodatas}}</text>
				</div>
			    
			  </wxc-tab-page>
		</div>
	</div>
</template>

<script>
	import {
		WxcMinibar,
		WxcTabPage,
		Utils
	} from 'weex-ui';
	import {getTransrecordByName,getTypeTransrecordByName,testaa} from './utils/trans'
	import {assetlist} from './utils/assetlist'
	
	//new
	import {getDbAssets} from './utils/asset_v2'
	import { getStorage,imgSrc } from './utils/config_v2';
	import {getCurrencyBalance, getActionHistory} from './utils/eos_v2'
	const dom = weex.requireModule('dom');
	const animation = weex.requireModule('animation')
	const storage = weex.requireModule("storage")
	const globalLan = require('./utils/language/global')
	const utils = require('./appUtils')
	const navigator = weex.requireModule('navigator')
	export default {
		components: {
			WxcMinibar,
			WxcTabPage
		},
		data(){
			return{
				name:"",
				asset:{},
				asset_balance:0,
				scrollerH: {},
				account:{},
				imgSrc: imgSrc,
				tabTitles:[
				],
				tabPageHeight:0,
				tabStyles:{
						bgColor: '#FFFFFF',
					    titleColor: '#666666',
					    activeTitleColor: '#3D3D3D',
					    activeBgColor: '#FFFFFF',
					    isActiveTitleBold: true,
					    iconWidth: 70,
					    iconHeight: 70,
					    width: 187.5,
					    height: 90,
					    fontSize: 32,
					    hasActiveBottom: true,
					    activeBottomColor: '#FFC900',
					    activeBottomHeight: 6,
					    activeBottomWidth: 120,
					    textPaddingLeft: 10,
					    textPaddingRight: 10,
					    normalBottomColor: 'rgba(0,0,0,0.4)',
					    normalBottomHeight: 2,
					    hasRightIcon: true,
					    rightOffset: 100
				},
				page:0,
				datas:"我是第一页",
				allTrans:[
				],
				outTrans:[],
				inTrans:[],
				otherTrans:[],
				currentChain:"",
				zhLan: {},
				globalLan: globalLan
			}
		},
		beforeCreate(){
			const tabPageHeight = Utils.env.getPageHeight();
			this.tabPageHeight = tabPageHeight
			console.log("获取到高度"+tabPageHeight)
			this.scrollerH = tabPageHeight 
			this.scrollerStyle = {
				height:this.scrollerH-200 +'px'
			}
			console.log("yangsji",this.scrollerStyle)
		},
		mounted() {
			
		},
		async created(){
			let chain = JSON.parse(await getStorage("ChainManager"));
			this.currentChain = chain.CurrentChain
			console.log("获取到currentChain: "+this.currentChain)
			let assetList = await getDbAssets(this.currentChain);
			console.log("当前资产列表",JSON.stringify(assetList))
			let data = JSON.parse(await getStorage('asset_handle'))
			console.log("获取到asset_handle")
			console.log(data)
			this.name = data.name
			for(let i=0;i<assetList.length;i++){
				if(assetList[i].name == this.name){
					this.asset = {
						name:this.name,
						account:assetList[i].account
					}
				}
			}
			
			let lan = await getStorage('lan')
			console.log("获取到lan了啊："+lan)
			if(!lan) {
				lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("asset_handle", lan)
			let tabT = []
			let title1 = {title:""}
			title1.title = this.zhLan.all
			tabT.push(title1)
			let title2 = {title:""}
			title2.title = this.zhLan.tran_out
			tabT.push(title2)
			let title3 = {title:""}
			title3.title = this.zhLan.tran_in
			tabT.push(title3)
			let title4 = {title:""}
			title4.title = this.zhLan.other
			tabT.push(title4)
			this.tabTitles = tabT
			
			
			this.account = JSON.parse(await getStorage("Account"));
			
			this.asset_balance = await getCurrencyBalance(this.account.account_name,this.name) + " " + this.name
			//this.asset_balance = await getCurrencyBalance(this.account.account_name,this.currentChain) + " " + this.name 
			let trans = await getActionHistory(this.account.account_name,this.currentChain)
			this.allTrans = trans.all
			this.outTrans = trans.from
			this.inTrans = trans.to
			// this.allTrans = await getTransrecordByName(this.account.account_name,this.name)
			// this.outTrans = await getTypeTransrecordByName(this.account.account_name,this.name,"tranout")
			// this.inTrans = await getTypeTransrecordByName(this.account.account_name,this.name,"tranin")
			// this.otherTrans = await getTypeTransrecordByName(this.account.account_name,this.name,"other")
			console.log("changdu",this.allTrans.length)
		},
		methods:{
			goBack() {
			    navigator.pop({
					animated: "true"
				}, event => {
					console.log('callback: ', event)
				})
			},
			jumpTransout(){
				let data = {symbol: this.name}
				storage.setItem("transfer",  JSON.stringify(data))
				navigator.push({
					url: utils.getUrl('transfer.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			jumpTransin(){
				navigator.push({
					url: utils.getUrl('scanner.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			wxcTabPageCurrentTabSelected(e){
				this.page = e.page
				switch (this.page) {
					case 0:
						this.datas = "我是第1页"
						this.$set(this.datas)
						break;
					case 1:
						this.datas = "我是第2页"
						this.$set(this.datas)
						break;
					case 2:
						this.datas = "我是第3页"
						this.$set(this.datas)
						break;	
					case 3:
						this.datas = "我是第4页"
						this.$set(this.datas)
						break;	
					default:
						break;
				}
				return
			},
			async goDetail(item){
				await storage.setItem("action", JSON.stringify(item), function (res) {});
				navigator.push({
					url: utils.getUrl('trans_detail.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			async test(){
				let a = await getTypeTransrecordByName("xigui2222222","YAS")
				console.log(a)
			}
		}
	}
</script>
<style scoped>
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
.coin-detail{
	height: 120px;
	flex-direction: row;
	justify-content: space-between;
	background-color: #FFFFFF;
}
.coin-img{
	width: 112.5px;
}
.coin-title{
	
}
.coin-name{
	margin-top: 25px;
	font-size: 30px;
}
.coin-account{
	font-size: 32px;
	color: #c7c7c7;
}
.coin-balance{
	font-size: 36px;
	line-height: 120px;
	margin-right: 20px;
}
.handle{
	flex-direction: row;
	background-color: #1E90FF;
	height: 100px;
}
.trans-out{
	width: 360px;
	height: 100px;
}
.trans-in{
	width: 360px;
	height: 100px;
}
.handle-results{
	background-color: #FFFFFF;
}
.handle-title{
	margin-left: auto;
	margin-right: auto;
	flex-direction: row;
	height: 100px;
}
.handle-name{
	height: 100px;
	line-height: 100px;
	color: white;
	font-size: 36px
}
.handle-image{
	margin-left: 140px;
}
.fenge{
	height:100px;
	color: #FFFFFF;
	font-size: 40px;
	line-height: 100px;
}
.data-show{
	width: 750px;
}
.table-list{
	flex-direction: row;
	height: 120px;
	background-color: #FFFFFF;
	    border-bottom-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
}
.tran-icon{
	width: 97.5px;
}
.tran-detail{
	height: 90px;
	margin-top: 15px;
	width: 390px;
}
.tran-amount{
	height: 90px;
	margin-top: 15px;
	width: 223px;
}
.tran-name{
	height: 45px;
	line-height: 45px;
	font-size: 32px;
}
.tran-time{
	height: 45px;
	line-height: 45px;
	font-size: 28px;
	color: #80848b;
}
.tran-count{
	height: 45px;
	line-height: 45px;
	font-size: 36px;
	color: #00EE83;
	text-align: right;
}
.tran-type{
	height: 45px;
	line-height: 45px;
	font-size: 28px;
	color: #80848b;
	text-align: right;
}
</style>