<template recyclable>
		<!-- <scroller :style="scrollerStyle" ref="index"> -->
	<div>
		<!-- <div v-if="isShow">
		 	<wxc-loading :show="isShow" type="default"></wxc-loading>
		 	<wxc-part-loading :show="isShow"></wxc-part-loading>
		 </div> -->
		<div v-if="isShow" :style="liststyle" class="wite">
			<image :src="`${imgSrc}title`" style="width: 750px; height: 400px;"></image>
			
			<div>
				<div class="no-data-title-box"><text class="no-data-title">{{zhLan.no_title}}</text></div>
				<div>
					<div class="no-data-box" @click="jump('private_key_import.js')">
						<div  class="no-data-image"><image :src="`${imgSrc}noi`" style="height: 50px;width: 50px"></image></div>
						<div class="no-datas no-data-border">
							<div>
								<div style="margin-bottom: 8px;"><text class="big">{{zhLan.have_wallet}}</text></div>
								<div><text class="small">{{zhLan.import_wallet}}</text></div>
							</div>
							<image :src="`${imgSrc}right_gray`"  style="height: 30px;width: 30px"></image>
						</div>
						
					</div>
					<div  class="no-data-box"  @click="jump('create_account.js')">
						<div  class="no-data-image"><image :src="`${imgSrc}noa`" style="height: 50px;width: 50px"></image></image></div>
						<div  class="no-datas">
							<div class="no-data-item">
								<div style="margin-bottom: 8px;"><text class="big">{{zhLan.no_wallet}}</text></div>
								<div><text class="small">{{zhLan.create_wallet}}</text></div>
							</div>
							<div><image :src="`${imgSrc}right_gray`" style="height: 30px;width: 30px"></image></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!isShow">
			<div class="navigator">
				<div @click="showWalletList" style="height: 70px;width: 305px;" class="account-top-left">
					<div style="margin-left:16px;" class="row">
						<text style="font-size:32px; line-height: 70px; color: #FFFFFF;">{{account.account_name}}{{clickTip}}</text>
						<image :src="`${imgSrc}right_button`" style="display: inline-block; height: 70px;width: 70px; margin-left:8px"></image>
					</div>
				</div>
				
				<div @click="minibarRightButtonClick" style="height: 50px;width: 50px">
					<image :src="`${imgSrc}sao`" style="height: 50px;width: 50px"></image>
				</div>
			</div>
			<div class="content">
				<div class="simple-info">
					<div class="info_total" @click="jumpAuthority">
						<text style="color:#FFFFFF; font-size:28px; margin-bottom:28px">{{zhLan.total_asset}}（$）</text>
						<text style="color:#FFFFFF; font-size:48px">{{totalAsset}}</text>
					</div>
					<div class="info_img">
						<image :src="`${imgSrc}img_lock`" style="height: 200px;width: 200px;margin-top:-50px"></image>
					</div>
				</div>
				<div class="actions-father">
					<div class="action-item" @click="goQrcode">
						<image :src="`${imgSrc}get_token`" class="action-img"></image>
						<text class="action-text">{{zhLan.receive}}</text>
					</div>
					<div class="action-item" @click="jumpTransfer(currentWallet)">
						<image :src="`${imgSrc}transfer`" class="action-img"></image>
						<text class="action-text">{{zhLan.transfer}}</text>
					</div>
					<div class="action-item" @click="goSourceManage">
						<image :src="`${imgSrc}panel_blue`" class="action-img"></image>
						<text class="action-text">{{zhLan.resources}}</text>
					</div>
				</div>

				<div class="list-title-box">
					<div>
						<text style="font-size: 32px;">{{zhLan.title}}</text>
					</div>
					<div>
						<image :src="`${imgSrc}add2`" mode="" @click="jumpSetAssets" style="height: 40px;width: 40px; margin-right: 20px;"></image>
					</div>
				</div>
				<div>
					<list class="list" >
						<cell class="list-item" v-for="(item,index) in assetList" :key="index" 
						@click="jumpAssetHandle(item.name)" track-by="balance" loadmoreoffset="100" @loadmore="loadmore">
							<div>
								<img :src="`${imgSrc}yas`" alt="" style="height: 80px;width: 80px; margin: 0 20px 0 10px">
								<div>
	
								</div>
							</div>
							<div class="list-item-right">
								<div><text class="coin-title">{{item.name}}</text></div>
								<div><text class="coin-title">{{item.balance}}</text></div>
							</div>
						</cell>
					</list>
				</div>
			</div>
		</div>
		<wxc-popup :show="isWalletListShow" @wxcPopupOverlayClicked="closeWalletList" pos="bottom" popup-color="rgb(255,255,255)"
		 style="background-color:#fff;z-index: 999;" height="750">
			<div class="wallet_list_top">
				<image :src="`${imgSrc}wal`" style="height: 40px;width: 40px" @click="goAccount"></image>
				<text style="font-size: 36px; color: #1E90FF; line-height: 90px;" @click="testa">{{zhLan.wallet_list}}</text>
				<image :src="`${imgSrc}close`" style="height: 40px;width: 40px" @click="closeWalletList"></image>
			</div>
			<div class="wallet_list_body">
				<div class="wallet_list_left">
					<scroller style="height:1000px;background-color:#eaeaea">
						<div v-for="(item,index) in chainList" :key="index" :style="chooseIndex != index?walletUnChooseStyle:walletChooseStyle"
						 @click="chooseWallet(item,index)">
							<div class="wallet-image">
								<image v-if="chooseIndex != index" :src="`${imgSrc}${unclickIcon[index]}`" style="height: 60px;width: 60px"></image>
								<image v-if="chooseIndex == index" :src="`${imgSrc}${clickIcon[index]}`" style="height: 60px;width: 60px"></image>
							</div>
						</div>
					</scroller>
				</div>
				<div class="wallet_list_right">
					<div class="wallet-name">
						<text style="font-size: 36px;">{{currentWallet}}</text>
						<image src="" style="width: 40px;height: 40px"></image>
					</div>
					<div>
						<scroller style="height: 600px;">
							<div  @click="switchTo(item, index)" v-for="(item,index) in walletList" :key="index">
								<div class="account-tag" v-if="item.chain == chainList[chooseIndex]">
									<div class="account-tag-left">
										<text style="padding-bottom: 15px;font-size: 32px;font-weight: 200; color: #FFFFFF;">{{item.account_name}}</text>
										<text style="font-size: 28px;color: #FFFFFF;">{{dealPubKey(item.pubkey)}}</text>
									</div> 
									<image :src="`${imgSrc}success_white`" v-if="item.account_name == selectedAccount.account_name && item.chain == selectedAccount.chain" 
									style="width: 40px;height: 40px; margin-right: 25px;"></image>
									<!-- <image :src="`${imgSrc}success_white`" v-if="account.account_name == item.account_name && item.chain == atChainName" 
									style="width: 40px;height: 40px; margin-right: 25px;"></image> -->
								</div>
							</div>
						</scroller>
					</div>
				</div>
			</div>
		</wxc-popup>
		<!-- </scroller> -->
	</div>
</template>

<style scoped>
	.main {
		background-color: #FFFFFF;
		opacity: 1;
	}

	.wite {
		background-color: #fff;
		width: 750px;
	}
	.no-data-title-box {
		width: 750px;
		font-size: 40px;
		color: #3c3c3c;
		font-weight: bold;
		padding-right: 30px;
		padding-left: 30px;
		margin-bottom: 50px;
	}
	.no-data-title {

		font-size: 40px;
		color: #3c3c3c;
		font-weight: bold;
	}
	.no-data-box {
		width: 750px;

		justify-content: flex-start;
		flex-direction: row;
		padding-right: 30px;
		padding-left: 30px;
		background-color: #fff;
		position: relative;
		height: 120px;
	}

	.no-data-image {
		height: 120px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30px;
		width: 50px;
	}

	.no-datas {
		width: 610px;
		height: 120px;
		/* background-color: red; */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

	}

	

	.no-data-border {
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
	}

	.big {
		font-size: 32px;
		color: #3c3c3c;
	}
	.small {
		font-size: 24px;
		color: #C0C0C0;
	}
	.navigator {
		/* border-bottom-width: 1px; */
		/* border-bottom-color: #C0C0C0;
		border-bottom-style: solid; */
		position: absolute;
		z-index: 99;
		background-color: #ffffff;
		width: 750px;
		height: 100px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		margin-bottom: 20px;
		/* position: absolute; */
		top: 0;
	}

	.account-top-left {
		background-color: #1E90FF;
		border-radius: 40px;
	}

	.content {
		margin-top: 110px;
		padding: 20px;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: stretch;
		height: 320px;
	}

	.actions-father {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: stretch;
		height: 160px;
		margin-top: 30px;
		/* margin-left: 60px; */
	}

	.action-item {
		align-content: center;
		/* background-color: #00c16b; */
		width: 240px;
		display: inline-block;
		vertical-align: middle;
	}

	.action-img {
		margin-left: 95px;
		margin-top: 27px;
		height: 60px;
		width: 60px;
	}

	.action-text {
		font-size: 28px;
		text-align: center;
		margin-top: 16px
	}

	.info_total {
		font-size: 32px;
		line-height: 35px;
		color: #FFFFFF;
		width: 400px;
		margin-left: 30px;
		/* margin-top: 30px; */
	}

	.info_img {
		width: 400px;
	}

	.simple-info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: stretch;
		/* background-color: #00BFFF; */
		background-image: linear-gradient(to bottom right, #1E90FF, #87CEFA);
		/* background: linear-gradient(to right,#1E90FF,#87CEFA); */
		box-shadow: 5px 5px 10px #D3D3D3;
		padding: 30px;
		border-radius: 30px;
		padding-left: 20px;
		height: 200px;
	}

	.simple-info-itm-one {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		justify-content: space-between;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.simple-info-itm-two {
		flex-direction: row;
		justify-content: flex-start;
	}

	.simple-info-itm-three {
		flex-direction: row;
		justify-content: flex-start;
		margin-bottom: 20px;
		margin-top: 10px;
	}

	.simple-info-item {
		font-size: 32px;
		line-height: 35px;
		color: #FFFFFF;
	}

	.simple-info-item-two {
		font-size: 34px;
		line-height: 35px;
		color: #FFFFFF;
	}

	.muti-choice-box {
		margin-top: 40px;
		background-color: #e2feef;
		padding: 30px;
		padding-left: 60px;
		padding-right: 60px;
		flex-direction: row;
		justify-content: center;
		border-radius: 10px;
	}

	.muti-choice-box-item {
		flex-direction: row;
		justify-content: flex-start;
	}

	.muti-choice-box-item-text {
		font-size: 36px;
		line-height: 40px;
		color: #00c16b;
	}

	.muti-choice-box-item-text1 {
		font-size: 40px;
		line-height: 40px;
		color: #00c16b;
	}
	.list {
        height:800px
    }
	.list-title-box {
		margin-top: 50px;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 40px;
	}

	.list-item {
		height: 120px;

		margin: 0px 10px;
		padding: 0px;
		/* padding-top: 0px;
		padding-bottom: 0px; */
		line-height: 120px;
		/* border-radius: 10px; */
		/* box-shadow:2px 2px 4px -1px gray; */
		flex-direction: row;
		align-items: center;
		/* justify-content: space-between; */

	}

	.list-item-right {
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		width: 600px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.coin-title {
		font-size: 36px;
		line-height: 80px;
		margin-left: 10px;
	}

	.coin-value {
		font-size: 28px;
		color: grey;
		text-align: right;
		margin-top: 10px;
	}

	.wallet_list_top {
		height: 90px;
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
		justify-content: space-between;
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		align-items: center;
	}

	.wallet_list_body {
		flex-direction: row;
	}

	.wallet_list_left {
		width: 130px;
	}

	.wallet-name-box {
		height: 110px;
		background-color: #E2E2E2;
		align-items: center;
		flex-direction: row;
	}

	.wallet_list_right {
		width: 550px;
		margin-left: 35px;
	}

	.wallet-name {
		height: 90px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.wallet-image {
		margin-left: 35px;
	}

	.account-tag {
		flex-direction: row;
		justify-content: space-between;
		height: 130px;
		background-color: #424242;
		align-items: center;
		margin-bottom: 10px;
		border-radius: 10px;
	}

	.account-tag-left {
		margin-left: 20px;

	}
</style>

<script>
	import {
		initChain
	} from './utils/chain'
	import {
		getLocalAccount,
		getCurrentAccountInfo,
		switchAccount
	} from './utils/account_v2'
	import {
		getCurrencyBalance
	} from './utils/eos_v2'
	import {
		getAssets,
		updateAssets,
		initDbAssets
	} from './utils/asset_v2'
	import {
		WxcMinibar,
		WxcPopup,
		Utils
	} from 'weex-ui';
	import {
		getStorage,
		imgSrc
	} from './utils/config_v2';
	import { getMarket } from './utils/trans.js'
	const scan = weex.requireModule('zfjg-scan')
	const modal = weex.requireModule('modal');
	const storage = weex.requireModule('storage')
	const animation = weex.requireModule('animation')
	const globalLan = require('./utils/language/global')
	const navigator = weex.requireModule('navigator')
  	const utils = require('./appUtils')
	export default {
		components: {
			WxcMinibar,
			WxcPopup
		},
		props:{
			heights: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				list: [1, 2, 3, 4, 5],
				account: {},
				currentAccount: {},
				account1: {},
				imgSrc: imgSrc,
				isShow: false,
				assetList: [],
				scanData: '',
				scrollerH: {},
				// scrollerStyle: {},
				//钱包列表
				isWalletListShow: false,
				chainList: [
					"TNT", "YAS", "EOS"
				],
				unclickIcon: ["tnt", "yas", "eos"],
				clickIcon: ["tnt", "yas", "eos"],
				chooseIndex: 0,
				currentWallet: "",
				atChainName:"",
				walletChooseStyle: {
					"height": "110px",
					"background-color": "#fff",
					"align-items": "center",
					"flex-direction": "row",
				},
				walletUnChooseStyle: {
					"height": "110px",
					"background-color": "#eaeaea",
					"align-items": "center",
					"flex-direction": "row",
				},
				walletList: [],
				accountList: {},
				currentChain: "",
				globalLan: globalLan,
				zhLan: {},
				totalAsset: 0,
				selectedAccount:{
					account_name:"",
					chain:""
				},		
				clickTip:"",
				chooWallet:[],
				totalAsset: 0,
				liststyle: {}
			}
		},
		beforeCreate() {
			const tabPageHeight = Utils.env.getPageHeight();
			console.log("获取到高度" + tabPageHeight)
			// this.scrollerH = (this.heights) + 'px'
			// this.scrollerStyle = {
			// 	height: this.scrollerH
			// }
			let listH = (tabPageHeight) + 'px'
			this.liststyle = {
				height : listH
			}
		},
		async created() {
			// this.isShow = true
			let lan = await getStorage('lan')
			let zhLan = {}
			if(!lan) {
				lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("home", lan)

			let chain = JSON.parse(await getStorage("ChainManager"));
			let account = JSON.parse(await getStorage("Account"));
			this.currentChain = chain.CurrentChain
			console.log("[0818] account: ", account.account_name)
			if(! account.account_name){
				// modal.toast({
				// 	'message': '请先导入账号',
				// 	'duration': 2
				// });
			}else{
				let assets = await getAssets(account.account_name, chain.CurrentChain);
				console.log("获取到assets")
				this.assetList = assets
				let total = 0
				for (let i = 0; i < assets.length; i++) {
					if(assets[i].unitPrice && assets[i].balance) {
						total += assets[i].unitPrice * assets[i].balance
					}
				}
				this.totalAsset = Math.floor(total*100) /100
			}
			this.currentWallet = this.chainList[0]

			let flag = true;
			storage.getItem("AccountManager_v2", res => {
				if (flag) { //getItem这里会执行两边，不知为何，所以做了个限制
					flag = false;
				} else {
					return
				}
				let AccountManager = JSON.parse(res.data);
				console.log("AccountManager_v2: ", AccountManager)
				//循环公链
				this.chainList.forEach(chainName => {
					console.log("chainName: ", chainName)
					//循环公钥
					let accountArray = []
					AccountManager[chainName].forEach(PubKeyItem => {
						//循环账号
						PubKeyItem.Accounts.forEach(accountItem => {
							console.log("account: ", accountItem.Account)
							this.walletList.push({
								chain:chainName,
								account_name: accountItem.Account,
								pubkey: PubKeyItem.PublicKey
							})

						})
					})
				});
				console.log("[0814]walletList: ", JSON.stringify(this.walletList))
			})
			
		},
		async mounted() {
			console.log("开始返回")
			const lanSet = new BroadcastChannel('refresh')
			const lanSet_account = new BroadcastChannel('account_home')
			let that = this
			lanSet.onmessage = async function (event) {
				console.log("获取到返回信息")
				let lan = await getStorage('lan')
				let zhLan = {}
				if(!lan) {
					lan = 'zh-CN'
				}
				
				that.zhLan = await that.globalLan.lang("home", lan)


			}

			const lanSet1 = new BroadcastChannel('account_refresh')
			lanSet1.onmessage = async function (event) {
				console.log("获取到返回信息1")
				that.account = JSON.parse(await getStorage("Account"));
				console.log("独有this.account: ", JSON.stringify(that.account))
				if(!that.account.account_name){
					that.clickTip = "点击切换账号"
				}

				
				if (that.account.account_name) {
					let chain = JSON.parse(await getStorage("ChainManager"));
					that.currentAccount = await getCurrentAccountInfo(that.account.account_name, chain.CurrentChain)
					that.currentWallet = chain.CurrentChain;
					that.currentChain = chain.CurrentChain
					that.clickTip = ""
					console.log("[0813]currentAccount: ", that.currentAccount)
					that.isShow = false
				} else {
					// modal.toast({
					// 	'message': '请先导入账号',
					// 	'duration': 2
					// });
					that.isShow = true
				}

				let flag = true;
				let assets = await getAssets(that.account.account_name, that.currentChain);
				console.log("获取到assets",assets)
				that.assetList = assets
				console.log("现在的资产列表",that.assetList)
				let total = 0
				for (let i = 0; i < assets.length; i++) {
					if(assets[i].unitPrice && assets[i].balance) {
						total += assets[i].unitPrice * assets[i].balance
					}
				}
				that.totalAsset = Math.floor(total*100) /100
				that.getAssetsBalance()
				storage.getItem("AccountManager_v2", res => {
					if (flag) { //getItem这里会执行两边，不知为何，所以做了个限制
						flag = false;
					} else {
						return
					}
					that.walletList = [];
					let AccountManager = JSON.parse(res.data);
					//循环公链
					that.chainList.forEach(chainName => {
						console.log("chainName: ", chainName)
						//循环公钥
						let accountArray = []
						AccountManager[chainName].forEach(PubKeyItem => {
							//循环账号
							PubKeyItem.Accounts.forEach(accountItem => {
								console.log("account: ", accountItem.Account)
								that.walletList.push({
									chain:chainName,
									account_name: accountItem.Account,
									pubkey: PubKeyItem.PublicKey
								})

							})
						})
					});
					console.log("[0820] 账号列表刷新结束 list: ", JSON.stringify(that.walletList))
				})
				//初始化公链对象
				initChain();
				//初始化资产列表
				initDbAssets();
				//获取账号余额
				that.getAssetsBalance()			
				//选中当前账号
				that.initCurrentAccount()

			}

			const assetsSet = new BroadcastChannel('assets_refresh')
			assetsSet.onmessage = async function (event) {
				console.log("获取到assets返回信息")
				let assets = await getAssets(that.account.account_name, that.currentChain);
				console.log("获取到assets",assets)
				that.assetList = assets
				console.log("现在的资产列表",that.assetList)
				let total = 0
				for (let i = 0; i < assets.length; i++) {
					if(assets[i].unitPrice && assets[i].balance) {
						total += assets[i].unitPrice * assets[i].balance
					}
				}
				that.totalAsset = Math.floor(total*100) /100
				that.getAssetsBalance()
			}
			
			lanSet_account.onmessage = async function (event) {
				console.log("[0820] 刷新账号列表")
				let flag = true;
				storage.getItem("AccountManager_v2", res => {
					if (flag) { //getItem这里会执行两边，不知为何，所以做了个限制
						flag = false;
					} else {
						return
					}
					that.walletList = [];
					let AccountManager = JSON.parse(res.data);
					//循环公链
					that.chainList.forEach(chainName => {
						console.log("chainName: ", chainName)
						//循环公钥
						let accountArray = []
						AccountManager[chainName].forEach(PubKeyItem => {
							//循环账号
							PubKeyItem.Accounts.forEach(accountItem => {
								console.log("account: ", accountItem.Account)
								that.walletList.push({
									chain:chainName,
									account_name: accountItem.Account,
									pubkey: PubKeyItem.PublicKey
								})

							})
						})
					});
					console.log("[0820] 账号列表刷新结束 list: ", JSON.stringify(that.walletList))
				})
			}

			this.account = JSON.parse(await getStorage("Account"));
			console.log("独有this.account: ", JSON.stringify(this.account))
			if(!this.account.account_name){
				this.clickTip = "点击切换账号"
			}

			
			if (this.account.account_name) {
				let chain = JSON.parse(await getStorage("ChainManager"));
				this.currentAccount = await getCurrentAccountInfo(this.account.account_name, chain.CurrentChain)
				this.currentWallet = chain.CurrentChain;
				this.clickTip = ""
				console.log("[0813]currentAccount: ", this.currentAccount)
				this.isShow = false
			} else {
				// modal.toast({
				// 	'message': '请先导入账号',
				// 	'duration': 2
				// });
				this.isShow = true
			}

			//初始化公链对象
			initChain();
			//初始化资产列表
			initDbAssets();
			//获取账号余额
			this.getAssetsBalance()			
			//选中当前账号
			this.initCurrentAccount()
		},

		methods: {
			chooseWallet(item, index) {
				this.currentWallet = item
				this.chooseIndex = ""
				this.chooseIndex = index

				let chWallet = this.walletList[this.chooseIndex]
				for(let i=0;i<chWallet.length;i++){
					this.$set(this.chooWallet, i, chWallet[i])
				}
				
			},
			async initCurrentAccount(){
				// let chain = JSON.parse(await getStorage("ChainManager"));
				this.selectedAccount.chain = this.currentWallet;
				this.selectedAccount.account_name = this.account.account_name;
				console.log("[0820] selectedAccount: ", JSON.stringify(this.selectedAccount))
			},
			async switchTo(item, index) {
				//切换公链
				let chain = JSON.parse(await getStorage("ChainManager"));
				chain.CurrentChain = this.currentWallet;
				storage.setItem("ChainManager", JSON.stringify(chain))

				//发送广播
				const lanSet = new BroadcastChannel('switchChain')
        		lanSet.postMessage('refresh')

				//更新当前选择的账号
				this.selectedAccount.chain = this.currentWallet;
				this.selectedAccount.account_name = item.account_name;

				//切换账号
				let res = await switchAccount(item.account_name, item.pubkey, this.currentWallet)
				this.account = JSON.parse(await getStorage("Account"));
			
				let assets = await getAssets(this.account.account_name, this.currentWallet);
				console.log("switchTo - assets: ", JSON.stringify(assets))
				this.assetList = assets
				// this.assetList = []
				// this.totalAsset = 0
				// for (let i = 0; i < this.assets.length; i++) {
				// 	let singleasset = {
				// 		name: this.assets[i].name,
				// 		balance: "0"
				// 	}
				// 	this.assetList.push(singleasset)
				// }
				
				if (res) {
					modal.toast({
						'message': '账号切换成功',
						'duration': 2
					});
					this.clickTip = ""
					this.isWalletListShow = !this.isWalletListShow
				}
				await this.getAssetsBalance()
			},
			dealPubKey(key) {
				return key.substring(0, 7) + "..." + key.substring(key.length - 6, key.length)
			},
			minibarLeftButtonClick() {},

			async getAssetsBalance() {
				
				console.log("查询余额开始")
				let markets = await getMarket(this.currentChain)
				console.log(markets)
				for (let i = 0; i < this.assetList.length; i++) {
					let balance = await getCurrencyBalance(this.account.account_name, this.assetList[i].name)
					console.log("balance", balance)
					if (balance == undefined) {
						balance = 0
					}
					for (let j = 0; j < markets.length; j++) {
						let name = markets[j].Name
						console.log("获取到name: "+name)
						if(name.toUpperCase() == this.assetList[i].name) {
							this.assetList[i].unitPrice = markets[j].Price
						}
					}

					this.assetList[i].balance = balance
				}
				
				let assets =  this.assetList
				let total = 0
				for (let i = 0; i < assets.length; i++) {
					if(assets[i].unitPrice && assets[i].balance) {
						total += assets[i].unitPrice * assets[i].balance
					}
				}
				this.totalAsset = Math.floor(total*100) /100
				await updateAssets(this.assetList, this.account.account_name, this.currentChain)
				console.log("查询余额结束", this.assetList)
			},
			minibarRightButtonClick() {
				let that = this
				scan.scanCode(res => {
					let data = res.data
					console.log("获取到扫码数据"+data)
					console.log("数据开头：" + data.substring(0, 9))
					if (data.substring(0, 9) == 'transfer&') {
						console.log("进入扫码转账逻辑"+data.length)
						if (data.length > 9) {
							console.log("获取到扫码数据1"+data)
							console.log("进入扫码转账判断"+ data.substring(0,9))
							let receiv = data.substring(9, data.length)
							console.log("数据是：" + receiv)
							storage.setItem("scanInfo", receiv, res => {
								console.log("添加扫码缓存 - OK")
							})

							let datas = {rece: receiv}
							storage.setItem("transfer",  JSON.stringify(datas))
							navigator.push({
								url: utils.getUrl('transfer.js'),
								animated: "true"
							}, event => {
								console.log('callback: ', event)
							})
						}
						return
					}

					if (data.substring(0, data.indexOf('&')) == "createAccount") {
						let totalInfo = data.substring(data.indexOf('&') + 1, data.length)
						let account = totalInfo.substring(0, totalInfo.indexOf('&'))
						let keys = totalInfo.substring(totalInfo.indexOf('&') + 1, totalInfo.length)
						let ownerPubKey = keys.substring(0, keys.indexOf('&'))
						let more = keys.substring(keys.indexOf('&') + 1, keys.length)
						let activePubKey = more.substring(0, more.indexOf('&'))
						let chainName = more.substring(more.indexOf('&')+1, more.length)
						if(that.currentChain != chainName) {
							modal.toast({
								'message': '请切换'+chainName+'账号',
								'duration': 2
							});
							return
						}
						
						let datas = {
							accountName: account,
							ownerPubKey: ownerPubKey,
							activePubKey: activePubKey,
							chainName:chainName
						}
						storage.setItem("create_account_for_other",  JSON.stringify(datas))
						
						navigator.push({
							url: utils.getUrl('create_account_for_other.js'),
							animated: "true"
							}, event => {
							console.log('callback: ', event)
						})
						return
					}
				})
			},
			click() {
				modal.toast({
					'message': 'click rightButton!',
					'duration': 1
				});
			},
			goAccount() {
				this.isWalletListShow = false
				navigator.push({
					url: utils.getUrl('accounts.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			goSourceManage() {
				navigator.push({
					url: utils.getUrl('source.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})			
			},
			async jumpTransfer(name) {
				if (name == "" || typeof(name) == undefined || name == "undefined") {
					name = this.currentWallet
				}

				let data = {symbol: name}
				storage.setItem("transfer",  JSON.stringify(data))
				navigator.push({
					url: utils.getUrl('transfer.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			jumpAssetHandle(name) {
				let data = {name: name}
				storage.setItem("asset_handle",  JSON.stringify(data))
				navigator.push({
					url: utils.getUrl('asset_handle.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},

			jumpAuthority(name) {
				let data = {chainName: this.currentChain,accountName:this.account.account_name}
				storage.setItem("authority",  JSON.stringify(data))
				navigator.push({
					url: utils.getUrl('authority.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			jump(name) {
				navigator.push({
					url: utils.getUrl(name),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			async jumpSetAssets() {
				navigator.push({
					url: utils.getUrl('set_assets.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			//let assets = ["YAS","VEDIO"]
			//await updateAssets()
			goQrcode() {
				navigator.push({
					url: utils.getUrl('scanner.js'),
					animated: "true"
					}, event => {
					console.log('callback: ', event)
				})
			},
			closeWalletList() {
				this.isWalletListShow = false
			},
			showWalletList() {
				this.isWalletListShow = !this.isWalletListShow
			},
			// testa(){
			// 	testaa()
			// },
		}
	};
</script>
