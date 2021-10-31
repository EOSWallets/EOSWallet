<template>
<div ref="priKeyIm" class="body">
	<!-- <div class="navigator">		
		<wxc-minibar title="导入私钥"
		background-color="#FFFFFF"
		text-color="#4ba363"
        @wxcMinibarLeftButtonClicked="goBack"		
		></wxc-minibar>
	</div> -->
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF" >{{zhLan.import_prikey}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
	<div class="main">
		<div class="tips-box">
			<div><text class="tips">{{private_key_create.new_tips1}}</text></div>
			<div><text class="tips">{{private_key_create.new_tips2}}</text></div>
			<div><text class="tips">{{private_key_create.new_tips2}}</text></div>
		</div>
		<div><textarea ref="prikey_inpu" v-model="privateKey" :placeholder="`${zhLan.enter_prikey}`" class="prikey" /></div>
		
		<!-- 选择公链 -->
        <div class="account-name">
            <div class="open-key-box">
                <text class="note">{{zhLan.choose_pubchain}}</text>
                <text class="choice-box" @click="openChainPop" style="margin-bottom: 20px;">{{zhLan.choose}}</text>
            </div>
			
			<!-- <div type="text" style="height:45px"  @click="openChainPop" placeholder="请选择公链" class="password">{{selectedChainName}}</div> -->
			<input type="text" v-model="selectedChainName" readonly="readonly" placeholder=""  class="password" :disabled="true"
			:enabled="false">
			
		</div>

		<!-- 设置密码 -->
		<div>
			<text class="note">{{zhLan.set_password}}</text>
		</div>
			<div>
				<div><input type="password" v-model="password" :placeholder="`${zhLan.password_enter_tips}`" class="password"></div>
				<div><input type="password" v-model="password2" :placeholder="`${zhLan.repeat_password}`" class="password"/></div>
				<!-- <div><input type="text" v-model="psdTips" :placeholder="`${zhLan.password_tips}`" class="password"/></div> -->
			</div>
		<div class="btn-box">
			<wxc-button size="big" :text="`${zhLan.import_now}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="importPriKey" :disabled="judgeIsDisabled"></wxc-button>
		</div>
		
	</div>
	<!-- 选择公链 弹窗 -->
    <wxc-popup 
        :show="showChainSelectPop"
        @wxcPopupOverlayClicked="closeChainSelectPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="410">
        <div>
            <div class="pop-header">
                <image :src="`${imgSrc}`"  mode="" style="height: 45px;width: 45px; left:20px;position:absolute"></image>
                <text class="text">{{zhLan.choose_pubchain}}</text>
                <image :src="`${imgSrc}close`"  mode="" style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeChainSelectPop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller">
                    <div class="pop-middle-item" @click="selectChainName(item)" v-for="(item, index) in chainList" :key="index">
                        <div>
                            <text class="pop-middle-item-text">{{item}}</text>
                        </div>
                    </div>
                </scroller>
            </div>
        </div>
    </wxc-popup>
	<wxc-loading :show="isShow" type="default" :need-mask="true"></wxc-loading>	
</div>
	
</template>

<script>
	import { WxcLoading, WxcButton, WxcPopup, WxcMinibar} from 'weex-ui';
	const modal = weex.requireModule('modal')
	import {CheckPrivateKeyValid, genPublicKey} from './utils/base_v2'
	import {encryptKey, genPwdMd5} from './utils/auth_v2'
	import {AESKey, imgSrc, chainList, getStorage} from './utils/config_v2'
	import {getAccountByPublicKey, addLocalAccount, getCurrentAccountInfo} from './utils/account_v2'
	const animation = weex.requireModule('animation')
	const navigator = weex.requireModule('navigator')
	const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	export default {
		components: { WxcLoading, WxcButton, WxcMinibar, WxcPopup },
		data() {
			return {
				privateKey: "",
				password:"",
				password2:"",
				psdTips:"",
				width: "100%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
				color: "#ffffff", 
				isShow: false,
				showChainSelectPop:false,
				selectedChainName:'请选择公链',
				imgSrc: imgSrc,
        		globalLan:globalLan,
				zhLan:{},
				private_key_create:{},
				currentLan: '',
				modal:{},
				chainList:[]
			};
		},
		computed:{
			btnStyle () {
				const { width, height, backgroundColor, borderColor, borderRadius } = this;
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
			textStyle () {
				const { fontSize, color } = this;
				const customStyle = {};
				if (fontSize) {
					customStyle.fontSize = fontSize;
				}	
				if (color) {
					customStyle.color = color;
				}
				return {
					fontSize, color
				}
			},
			judgeIsDisabled() {
				if(!this.privateKey) {
					return true
				}
				if(!this.password) {
					return true
				}
				if (!this.password2) {
					return true
				}
				if (this.password != this.password2) {
					return true
				}
				return false
			},
		},
		watch: {

		},
		async created(){
			//获取公链列表
			this.chainList = chainList

    		//语言包
    		let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		}
    		if(lan == 'en-US') {
    		  this.currentLan = "English"
    		}else {
    		  this.currentLan = '简体中文'
    		}

			this.zhLan = await this.globalLan.lang("private_key_import", lan)
			this.private_key_create = await this.globalLan.lang("private_key_create", lan)
			this.modal = await this.globalLan.lang("modal", lan)
		},
		mounted() {
        	var testEl = this.$refs.priKeyIm;
       		animation.transition(testEl, {
            styles: {
                color: '#FF0000',
                opacity: 1
            },
            duration: 800, //ms
            timingFunction: 'ease',
            delay: 0 //ms
            }, function () {
        })
    },
		methods:{
			openChainPop(){
				if(this.$refs["prikey_inpu"]){
					this.$refs["prikey_inpu"].blur()
				}
				this.showChainSelectPop = !this.showChainSelectPop;
			},
			selectChainName(chainName) {
				this.selectedChainName = chainName;
				this.showChainSelectPop = !this.showChainSelectPop;
			},
			closeChainSelectPop() {
				this.showChainSelectPop = !this.showChainSelectPop;
			},
			goBack() {
        		const lanSet = new BroadcastChannel('account_refresh')
				lanSet.postMessage('refresh')
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
            },
			async importPriKey(e) {
				const { type, disabled } = e;
				console.log(disabled)
				if(disabled) {
					return
				}

				this.isShow = true
				//校验是否已选择公链
				if(this.chainList.indexOf(this.selectedChainName) == -1){
					modal.toast({
						message: this.modal.choose_pubchain,
						duration: 2
					})
					this.isShow = false
					return
					
				}
				// 校验私钥是否valid
				let isValid = await CheckPrivateKeyValid(this.privateKey)
				console.log("私钥检验结果",isValid)
				if (!isValid) {
					modal.toast({
						message: this.modal.private_key_notexist,
						duration: 2
					})
					this.isShow = false
					return
				}
				if (this.password.length < 8){
					modal.toast({
						message: this.modal.password_atleast,
						duration: 2
					})
					this.isShow = false
					return
				}
				var a = /[0-9]/
				var b = /[a-z]/
				var hasNum = a.test(this.password)
				var hasChar = b.test(this.password)

				if (!(hasNum && hasChar)){
					modal.toast({
						message: this.modal.password_toosimple,
						duration: 2
					})
					this.isShow = false
					return
				}

				// 获取公钥
				let publicKey = await genPublicKey(this.privateKey)
				if (!publicKey) {
					modal.toast({
						message: this.modal.privatekey_importfail,
						duration: 2
					})
					this.isShow = false
					return
				}
				console.log("公钥是："+publicKey) 
				console.log("密码是："+this.password)

				// 加密私钥
				console.log("开始加密私钥")
				let enPrekey = await encryptKey(this.password, publicKey, this.privateKey)
				if(!enPrekey) {
					modal.toast({
						message: this.modal.privatekey_importfail,
						duration: 2
					})
					this.isShow = false
					return
				}
				console.log("enPrekey :", enPrekey)

				// 加密密码
				console.log("开始加密密码")
				let enPwd = await genPwdMd5(this.password)
				if(!enPwd) {
					modal.toast({
						message: this.modal.privatekey_importfail,
						duration: 2
					})
					this.isShow = false
					return					
				}
				console.log("enPwd :", enPwd)

				// 获取该公钥下账号信息
				console.log("获取该公钥下账号信息")
				let res = await getAccountByPublicKey(publicKey, this.selectedChainName)
				console.log("0817 res: ", JSON.stringify(res))
				if(res == []){
					modal.toast({
						message: this.modal.privatekey_importfail,
						duration: 2
					})
					this.isShow = false
					return	
				}
				let accounts = []

				console.log(res.account_names)
				for(let i = 0; i < res.account_names.length; i++) {
					let info = await getCurrentAccountInfo(res.account_names[i], this.selectedChainName)
					console.log("获取到账号信息："+JSON.stringify(info))
					console.log("账号名称为"+info.account_name)
					let permissions = []
					for(let j = 0; j < info.permissions.length; j++) {
						console.log()
						permissions.push(info.permissions[j].perm_name)
					}
					console.log(permissions)
					let account = {
						Account: res.account_names[i],
						Permission: permissions,
						Currency : [this.selectedChainName]
					}

					accounts.push(account)
				}

				// 构建账号信息数据
				let account = {
					PublicKey: publicKey,
					PrivateKeyEncrypt: enPrekey.ciphertext,
					PasswordEncrypt: enPwd,
					Accounts: accounts,
					Balance:'0'
				}

				// 账号信息保存到本地
				await addLocalAccount(account, this.selectedChainName).then(()=>{
					console.log("[0819] 001")
				})
				console.log("[0819] 002")
				this.isShow = false
				modal.toast({
					message: this.modal.privatekey_importsucc,
					duration: 2
				})
				this.judgeIsDisabled = false
				
				const lanSet = new BroadcastChannel('account_refresh')
        		lanSet.postMessage(this.selectedChainName)
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			}
		}
	}
</script>

<style scoped >
.body {
	opacity: 1;
}
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
 	.text{
        font-size: 36px;
        font-weight:bold;
    }
    .pop-middle {
        /* height: 800px; */
        padding: 0 20px;
    }
    .pop-middle-item {
        height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 0 10px;

    }
    .pop-middle-item-text {
        font-size: 28px;
        text-align: center;
    }
    .scroller {
        height: 520px;
    }

    .account-name {
        padding: 20px 0 0 0;
        /* border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; */
        margin-bottom: 10px;
    }
    .open-key-box {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .choice-box {
        background-color: #e6fef1;
        font-size: 28px;
        color: #1E90FF;
        width: 100px;
        align-items: center;
        text-align: center;
        justify-content: center;
        line-height: 50px;
        height: 50px;
    }

	.navigator {
    	border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		width: 750px;
        height: 120px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
		background-color: #ffffff;
	}
	.main {
		padding: 40px;
	}
	.tips-box {
		background-color: #e3e3e3;
		padding: 20px;
		border-radius: 10px;
	}
	.tips {
		font-size: 20px;
/* 		letter-spacing: 5px; */
		line-height: 35px;
		color: #555555;
	}
	.prikey {
		border-width:1px;  
		border-color:#C0C0C0;  
		border-style:solid;  
		margin-top: 50px;
		border-radius: 10px;
		height: 120px;
		font-size: 28px;
		padding: 10px;
		padding-top: 20px;
		margin-bottom: 50px;
	}
	
	.note {
		font-size: 32px;
		margin-bottom: 20px;
	}
	
	.password {
		font-size: 28px;
		margin-bottom: 10px;
		border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
		padding-left: 20px;
		outline: none;
		height: 80px;
		padding-bottom: 10px;
	}
	.btn-box {
		margin-top: 50px;
	}
</style>
