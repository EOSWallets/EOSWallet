<template>
	<div>
		
		<!-- <div style="height: 600px;">
			<div class="pop-header">
				<text class="text">{{zhLan.trans_sign}}</text>
				<image :src="`${imgSrc}close`" mode="" style="height: 45px;width: 45px; right:20px;position:absolute" @click="closeTransferPop"></image>
			</div>

			<div style=" height: 500px;padding: 0 20px;">
				<div style="flex-direction:row; justify-content:center; align-items:center; margin-top:20px;height: 40px;">
					<text style="font-size:32px;line-height: 40px;">{{account.account_name}}</text>
					<text style="font-size:32px;background-color: #58be74;line-height: 40px;padding-bottom: 3px;" @click="choosePerMiss">@{{chosedPer}}</text>
				</div>
				<div style="flex-direction:row; margin-top: 40px;margin-left: 50px;">
					<text style="font-size:32px">{{zhLan.enter}}</text>
					<text style="background-color:#58be74;padding:5px;font-size:32px;color:#ffffff">{{publicKeyFormatterShort(chosedPubKey)}}</text>
					<text style="font-size:32px">{{zhLan.ofprikey_password}}</text>
				</div>

				<div>
					<input type="password" return-key-type="done" autofocus="true" @keyboard="keyboardChange" v-model="password"
					 :placeholder="`${zhLan.this_password}`" class="acc-password">
				</div>

				<div>
					<text class="tips" style="padding-top:10px;margin-left: 50px;">{{zhLan.forget_password_show}}</text>
				</div>

				<div style="margin-top: 50px; align-items: center; height:200px">
					<wxc-button size="big" :text="`${zhLan.confirm}`" :textStyle="textStyle" :btnStyle="btnStyle" style=""
					 @wxcButtonClicked="ensureEdit" :disabled="judgeIsDisabled"></wxc-button>
				</div>
			</div> -->
		<!-- <wxc-popup :show="!isChoosePerShow" @wxcPopupOverlayClicked="closeTransferPop" pos="bottom" popup-color="rgb(255,255,255)"
		 style="background-color:#fff" :height="keyboardLength"> -->

			<list>
				<cell>
				<div class="pop-header">
					<text class="text">{{zhLan.trans_sign}}</text>
					<image :src="`${imgSrc}close`" mode="" style="height: 45px;width: 45px; right:20px;position:absolute" @click="closeEnsurePop"></image>
				</div>

				<div class="pop-middle1">
					<div style="flex-direction:row; justify-content:center; align-items:center; padding:20px 0 40px 0; height:90px">
						<text style="font-size: 32px;">{{account.account_name}}</text>
						<text style="font-size:32px;background-color: #1E90FF;border-radius: 3px;" @click="choosePer"> @{{chosedPer}}</text>
					</div>
					<div style="flex-direction:row; margin-bottom:20px">
						<text style="font-size: 32px;line-height:42px">{{zhLan.enter}}</text>
						<text style="background-color:#1E90FF;padding:5px;font-size: 32px;color:#ffffff">{{publicKeyFormatterShort(chosedPubKey)}}</text>
						<text style="font-size: 32px;line-height:42px">{{zhLan.ofprikey_password}}</text>
					</div>

					<div>
						<input ref="numInput3" type="password" v-model="password" :placeholder="`${zhLan.this_password}`" class="password"
						 @keyboard="keyboardChange">
					</div>

					<div>
						<text class="tips1" style="padding-top:10px">{{zhLan.forget_password_show}}</text>
					</div>
					<div style="align-items:center">
						<div class="btn-box">
							<wxc-button :text="`${zhLan.confirm}`" :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto"
							 @wxcButtonClicked="ensure"></wxc-button>
						</div>
					</div>
				</div>
			</cell>
			</list>
		<!-- </wxc-popup> -->
		<wxc-popup :show="isChoosePerShow" @wxcPopupOverlayClicked="closeChoosePerPop" pos="bottom" popup-color="rgb(255,255,255)"
		 style="background-color:#fff" height="600">
			<div style="height: 600px;">
				<div class="pop-header">
					<text class="text">选择权限</text>
					<image :src="`${imgSrc}close`" mode="" style="height: 45px;width: 45px; right:20px;position:absolute" @click="closeChoosePerPop"></image>
				</div>
				<list style="height:480px">
					<cell v-for="(item,index) in perMissList" :key="index" style="align-items: center;">
						<div style="flex-direction: row;align-items: center;width: 600px;height: 70px;margin-top: 10px;
					border-bottom-width: 1px;border-bottom-color: #C0C0C0;border-bottom-style: solid;"
						 @click="locatePer(item)">
							<text>{{publicKeyFormatterShort(item.pubkey)}}@</text>
							<text>{{item.per}}</text>
						</div>

					</cell>
				</list>

			</div>
		</wxc-popup>
	</div>
</template>
<script>
	import {
		WxcPopup,
		WxcButton
	} from 'weex-ui';
	import {
		getStorage,
		imgSrc
	} from "./utils/config"
	import {
		checkPassword
	} from "./utils/auth_v2"
	import {
		getCurrentAccountInfo,
		getAccountByPublicKey
	} from "./utils/account_v2"
	const globalLan = require('./utils/language/global')
	const storage = weex.requireModule('storage');
	export default {
		components: {
			WxcPopup,
			WxcButton
		},
		data() {
			return {
				perMissList: [],
				isChoosePerShow: false,
				globalLan: globalLan,
				zhLan: {},
				modalLan: {},
				chainName: "",
				accountName: "",
				account: "",
				keyboardLength:"600",
				password:"",
				borderColor: "",
				borderRadius: "",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
				color: "#ffffff",
			}
		},
		computed: {
			btnStyle() {
				const {
					width,
					height,
					backgroundColor,
					borderColor,
					borderRadius
				} = this;
				const customStyle = {};
				if (width) {
					customStyle.width = width;
				}
				if (height) {
					customStyle.height = height;
					customStyle.lineHeight = height;
				}
				if (backgroundColor) {
					customStyle.backgroundColor = backgroundColor;
				}
				if (borderColor) {
					customStyle.borderColor = borderColor;
					customStyle.borderWidth = '1px';
					customStyle.borderStyle = 'solid';
				}
				if (borderRadius) {
					customStyle.borderRadius = borderRadius;
				}
				return customStyle;
			},
			textStyle() {
				const {
					fontSize,
					color
				} = this;
				const customStyle = {};
				if (fontSize) {
					customStyle.fontSize = fontSize;
				}
				if (color) {
					customStyle.color = color;
				}
				return {
					fontSize,
					color
				}
			},
			judgeIsDisabled() {
				if (!this.password) {
					return true
				}
				return false
			},

		},
		async mounted() {
			console.log("获取语言开始", lan)
			let lan = await getStorage('lan')
			console.log("语言类型", lan)
			let zhLan = {}
			if (!lan) {
				lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("authority_edit", lan)
			this.modalLan = await this.globalLan.lang("modal", lan)
			console.log("语言包", JSON.stringify(this.zhLan))
		},
		async created() {
			console.log('我已进入')
			let toSign = JSON.parse(await getStorage("to_sign"))
			console.log("获取到数据", toSign)
			this.accountName = toSign.accountName
			this.chainName = toSign.chainName
			// this.listen()
			console.log("获取到数据", this.accountName, this.chainName)
			this.initShowData()
			//this.shout()

		},
		methods: {
			listen() {
				// let that = this
				// let authority = new BroadcastChannel('to_sign')
				// authority.onmessage = function(event) {
				// 	console.log("接收到监听", event.data) // Assemble!
				// 	let msg = JSON.parse(event.data)
				// 	that.accountName = event.data.accountName
				// 	that.chainName = event.data.chainName
				// }
			},
			//data is a josn type string
			choosePer() {
				this.isChoosePerShow = true
			},
			closeChoosePerPop() {
				this.isChoosePerShow = false
			},
			async initShowData() {

				//let account = JSON.parse(await getStorage("Account"));
				this.account = await getCurrentAccountInfo(this.accountName, this.chainName);
				let allAccountList = JSON.parse(await getStorage("AccountManager_v2"))
				this.accountList = allAccountList[this.chainName]


				let pubKeyList = []
				let perMissList = []
				//获取用户导入过的公钥
				for (let i = 0; i < this.accountList.length; i++) {
					console.log("获取到公钥", this.accountList[i].PublicKey)
					pubKeyList.push(this.accountList[i].PublicKey)
				}
				//获取当前账号里所有的权限
				for (let i = 0; i < this.account.permissions.length; i++) {
					for (let j = 0; j < this.account.permissions[i].required_auth.keys.length; j++) {
						if (pubKeyList.indexOf(this.account.permissions[i].required_auth.keys[j].key) != -1) {
							let per = {
								pubkey: this.account.permissions[i].required_auth.keys[j].key,
								per: this.account.permissions[i].perm_name
							}
							perMissList.push(per)
						}
					}
				}
				this.perMissList = perMissList
				this.chosedPer = this.perMissList[0].per
				this.chosedPubKey = this.perMissList[0].pubkey
			},
			locatePer(item) {
				this.chosedPer = item.per
				// this.chosedPubKey = this.oldPermission.required_auth.keys[this.accIndex].key
				this.chosedPubKey = item.pubkey
				this.isChoosePerShow = false

			},
			publicKeyFormatterShort(publicKey) {
				return publicKey ? publicKey.substring(0, 10) + "..." + publicKey.substring(publicKey.length - 10, publicKey.length) :
					""
			},
			keyboardChange(e){
					  if(e.isShow){
						  let keyboard = new BroadcastChannel('keyboard')
						  let data = {show:true}
						  keyboard.postMessage(data)
					  }else{
						  let keyboard = new BroadcastChannel('keyboard')
						  let data = {show:false}
						  keyboard.postMessage(data)
					  }
			},
			ensure(){
				console.log("点击按钮")
				let signTo = new BroadcastChannel('sign_to')
				let data = {pubkey:this.chosedPubKey,permission:this.chosedPer,password:this.password}
				signTo.postMessage(data)
			}
		}
	}
</script>

<style>
	.pop-header {
		flex-direction: row;
		text-align: center;
		align-items: center;
		justify-content: center;
		padding: 20px;
		height: 120px;
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
	}

	.text {

		font-size: 36px;
		font-weight: bold;
	}

	.pop-middle {
		/* height: 240px; */
		padding: 20px 20px;
		align-items: center;
		justify-content: center;

	}

	.pop-middle1 {
		padding: 0 20px;
	}

	.pop-middle-item {
		height: 120px;
		width: 400px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 40px;
		background-color: #e6fef1;
		margin: 10px 0;
	}
	.password {
		font-size: 32px;
	    padding: 0 0 10px 20px;
	    outline: none;
	    border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
	    height: 80px;
	}
	.tips1 {
	    font-size: 28px;
	    color: gray;
	    padding-top: 20px;
	}
	
</style>
