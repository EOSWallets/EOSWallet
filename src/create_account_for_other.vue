<template>
<div class="body" ref="create2">
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF;" >{{zhLan.create_account}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
	<div class="main">
		<div>
			<div class="account-name">
				<text class="account-name-title">{{zhLan.account_name}}</text>
                <text class="password1">{{accountName}}</text>
			</div>

            <div class="account-name" v-if="OAA">
                <div class="open-key-box">
                    <text class="account-name-title">owner {{zhLan.and}} active {{zhLan.pubkey}}</text>
                </div>
				<text class="password1">{{ownerPubKey}}</text>
			</div>
		</div>
        
		<div class="btn-box">
			<wxc-button size="big" :text="zhLan.confirm"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="submit" :disabled="judgeIsDisabled"></wxc-button>
		</div>
	</div>

	<wxc-dialog :title="`${zhLan.ple_confirm}`"
                :content="`${zhLan.confirm_content}`"
                :show="showDialog"
                :single="false"
                :is-checked="false"
				@wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
    </wxc-dialog>

	<!-- 账号信息确认dialog -->
	<wxc-popup 
        :show="isConfirmShow"
        @wxcPopupOverlayClicked="closeConfirmPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="900">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.confirm_account_info}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeConfirmPop"></image>
            </div>
            
            <div class="pop-middle">
                    <div class="pop-middle-item3">
						<text class="pop-middle-item3-left">{{zhLan.new_account_name}}</text>
						<text class="pop-middle-item3-right">{{accountName}}</text>
                    </div>
					<div class="pop-middle-item3">
						<text class="pop-middle-item3-left">owner {{zhLan.pubkey}}</text>
						<text class="pop-middle-item3-right">{{publicKeyFormatter2(ownerPubKey)}}</text>
                    </div>
					<div class="pop-middle-item3">
						<text class="pop-middle-item3-left">active {{zhLan.pubkey}}</text>
						<text class="pop-middle-item3-right">{{publicKeyFormatter2(activePubKey)}}</text>
                    </div>

					<div class="cost-box">
						<div class="cost-box-item">
							<text class="cost-box-item-top-left">{{zhLan.fee}}</text>
							<text class="cost-box-item-top-right">{{ramPrice + 0.0004}} {{chainName}}</text>
						</div>
						<div  class="cost-box-item">
							<text class="cost-box-item-text">{{zhLan.ram}} {{Math.round(ram/1024)}} KB</text>
							<text class="cost-box-item-text">{{ramPrice}} {{chainName}}</text>
						</div>
						<div  class="cost-box-item">
							<text class="cost-box-item-text">{{zhLan.other_fee}}</text>
							<text class="cost-box-item-text">0.0004 {{chainName}}</text>
						</div>
						<!-- <div  class="cost-box-item">
							<text class="cost-box-item-text">带宽 72.05 KB</text>
							<text class="cost-box-item-text">0.1873 Yas</text>
						</div> -->
					</div>
					<div class="btn-box">
						<wxc-button size="big" :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirmInfo"></wxc-button>
					</div>
            </div>
        </div>
    </wxc-popup>

	<wxc-popup 
        :show="ischooseAccountShow"
        @wxcPopupOverlayClicked="closeChooseAccountPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="800">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.choose_act_account}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeChooseAccountPop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller">
					<div v-for="(account,index) in accounts" :key="index">
						<div v-for="(item, index1) in account.Accounts" :key="index1">
							<div class="pop-middle-item2" @click="chooseCreatorAccount(item.Account,account.PublicKey, permission)" v-for="(permission, index2) in item.Permission" :key="index2">
								<text class="pop-middle-item-text">{{item.Account}} @{{permission}}</text>
								<wxc-icon name="more"></wxc-icon>
                    		</div>
						</div>

					</div>

                </scroller>
            </div>
        </div>
    </wxc-popup>

	<wxc-popup 
        :show="istransferShow"
        @wxcPopupOverlayClicked="closeTransferPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        :height="popH">
        <div>
            <div class="pop-header">
                <text class="text">{{tran_sign.trans_sign}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeTransferPop"></image>
            </div>
            
            <div class="pop-middle">
				<div class="middle-top">
					<div style="justify-content:center; align-items:center;">
						<text style="font-size:28px">{{creator}} @{{creatorPermission}}</text>
					</div>
				</div>

				<div style="flex-direction:row;">
					<text style="font-size:28px">{{tran_sign.enter}}</text>
					<text style="background-color:#1E90FF;padding:5px;font-size:28px;color:#ffffff">{{publicKeyFormatter3(creatorPubkey)}}</text>
					<text style="font-size:28px">{{tran_sign.ofprikey_password}}</text>
				</div>

				<div class="password-item">
					<input type="password" v-model="password" :placeholder="`${tran_sign.this_password}`" class="password" @keyboard="popKeyBoard"/>
				</div>

				<div>
					<text class="cost-box-item-text" style="padding-top:10px">{{tran_sign.forget_password_show}}</text>
				</div>
					<div class="btn-box">
						<wxc-button size="big" :text="`${tran_sign.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureTransfer" :disabled="judgeIsDisabled"></wxc-button>
					</div>
            </div>
        </div>
    </wxc-popup>
	<wxc-loading :show="isShow" type="default" :need-mask="true" :mask-style="maskStyle"></wxc-loading>
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, WxcLoading, Utils } from 'weex-ui';
	import { checkPassword} from "./utils/auth_v2"
	import { createNewAccount, getRamPrice } from './utils/eos_v2' 
	import { getCurrentAccountInfo, switchAccount, addLocalAccount } from './utils/account_v2'
	const { Api, JsonRpc } = require('eosjs');
	const modal = weex.requireModule('modal')
	const storage = weex.requireModule('storage')
	import { imgSrc, getStorage } from "./utils/config";
	const animation = weex.requireModule('animation')
	import WeexQrcode from 'weex-qrcode'
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	export default {
		components: { WxcButton,WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, WeexQrcode,WxcLoading },
		data() {
			return {
				imgSrc: imgSrc,
                OAA: true,
				isConfirmShow: false,
				ischooseAccountShow: false,
				istransferShow: false,
				showDialog: false,
				comformShort: false,
				width: "100%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '36px',
                color: "#ffffff", 
                openKey:"",
				accountName: "",
				ownerPubKey: "",
				activePubKey: "",
				pubKeyType: 1,
				accounts: [],
				password: "",
				creator: '',
				creatorPubkey: '',
				creatorPermission: '',
				ram: 2996,
				ramPrice: 0,
				qrText: '',
				qrCell: 400,
				isShow: false,
				popH: 600,
        		globalLan:globalLan,
        		zhLan:{},
				tran_sign:{},
				zhLan1:{},
				modelLan:{},
				chainName: '',

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
			maskStyle () {
				let pageHeight = Utils.env.getPageHeight();
				return {
					height: pageHeight+'px'
				}
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
            },
		},
		mounted() {

		},
		async created() {
			// if (this.$route.query.accountName) {
			// 	this.accountName = this.$route.query.accountName
			// 	this.ownerPubKey = this.$route.query.ownerPubKey
            //     this.activePubKey = this.$route.query.activePubKey;
            // }
			let param = JSON.parse(await getStorage("create_account_for_other"))
			this.accountName = param.accountName
			this.ownerPubKey = param.ownerPubKey
			this.activePubKey = param.activePubKey;
			this.chainName = param.chainName
			
			this.ramPrice = await getRamPrice(this.ram/1024)
			this.accounts = JSON.parse(await getStorage("AccountManager"))
    		//语言包
    		let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		}

			this.zhLan = await this.globalLan.lang("create_account_for_other", lan)
			this.zhLan1 = await this.globalLan.lang("modal", lan)
			this.modelLan = await this.globalLan.lang("modal", lan)
			this.tran_sign = await this.globalLan.lang("tran_sign", lan)
		},
		methods:{
			popKeyBoard(e) {
				console.log("弹出输入框")
				console.log(e)
				if(e.isShow) {
					this.popH = 600 + e.keyboardSize + 100
				}else {
					this.popH = 600
				}
			},
			// getStorageAccounts() {
			// 	storage.getItem("AccountManager", res =>{
			// 		this.accounts = JSON.parse(res.data)
			// 		console.log("获取到账号列表" + JSON.stringify(this.accounts))
			// 		console.log(this.accounts.length)
			// 	})
			// },
			publicKeyFormatter(publicKey) {
                return publicKey? publicKey.substring(0,16) + "..." + publicKey.substring(publicKey.length-17,publicKey.length): ""
			},
			publicKeyFormatter2(publicKey) {
                return publicKey? publicKey.substring(0,10) + "..." + publicKey.substring(publicKey.length-11,publicKey.length): ""
			},
			publicKeyFormatter3(publicKey) {
                return publicKey? publicKey.substring(0,3) + "..." + publicKey.substring(publicKey.length-4,publicKey.length): ""
			},
			confirmInfo() {
				this.isConfirmShow = false
				this.ischooseAccountShow = true
			},
			chooseCreatorAccount(account,pubKey, permission) {
				this.creator = account
				this.creatorPubkey = pubKey
				this.creatorPermission = permission
				console.log("取到账号和公钥")
				console.log(account)
				console.log(pubKey)
				this.ischooseAccountShow = false
				this.popH = 600
				this.istransferShow = true
			},
			goBack() {
				console.log("创建账号点击返回")
                // this.$router.go(-1)
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},
			wxcDialogCancelBtnClicked() {
				this.showDialog = false
			},
			wxcDialogConfirmBtnClicked() {
				this.comformShort = true
				this.showDialog = false
				this.submit()
			},
			async submit() {
				var j =  /^[1-5a-z]+$/

				if(this.OAA) {
					this.activePubKey = this.ownerPubKey
				}

				if (this.accountName == "") {
					modal.toast({
						message: this.zhLan1.accountname_notnull,
						duration: 2
					})
					return					
				}

				if (!j.test(this.accountName)){
					modal.toast({
						message: this.zhLan1.modal.accountname_rex,
						duration: 2
					})
					return
				}

				if (this.accountName.length > 12){
					modal.toast({
						message: this.modelLan.account_notless,
						duration: 2
					})
				}

				if (this.accountName.length < 12 && !this.comformShort){
					this.showDialog = true
					return
				}

				if (!j.test(this.accountName) && this.comformShort){
					modal.toast({
						message: this.zhLan1.account_toosimple,
						duration: 2
					})
					return
				}

				if (!this.activePubKey || !this.ownerPubKey) {
					modal.toast({
						message: this.zhLan1.enter_pubkey,
						duration: 2
					})
					return					
				}

				let chainManager = JSON.parse(await getStorage('ChainManager'))
        		let chainName = chainManager.CurrentChain
				let account = await getCurrentAccountInfo(this.accountName,chainName)
				console.log("获取到链上账号信息：", JSON.stringify(account))
				if(JSON.stringify(account) != "{}") {
					modal.toast({
						message: this.zhLan1.account_exist,
						duration: 2
					})
					return	
				}
				

				this.isConfirmShow = true


			},
			// 输入密码确认交易
			async ensureTransfer() {
				this.isShow = true
				this.istransferShow = false
				let validPwd = await checkPassword(this.creatorPubkey,this.password)
                if(!validPwd){
					this.isShow = false
                    modal.toast({
                        message: this.zhLan1.password_notmatch,
                        duration: 2
                    })
                    return
				}
				let form = {
					password: this.password,
					publicKey: this.creatorPubkey,
					creator: this.creator,
					name: this.accountName,
					owner: this.ownerPubKey,
					active: this.activePubKey,
					symbols: this.chainName,
					permission: this.creatorPermission,
					ramBytes: this.ram,
				}

				let message = await createNewAccount(form)
				console.log("账号创建标识："+JSON.stringify(message))
				if(JSON.stringify(message) == "{}") {
					this.isShow = false
					modal.toast({
						message: this.zhLan1.account_createfail,
						duration: 2
					})
					return 
				}

				this.isShow = false
				modal.toast({
					message: this.zhLan1.account_createsuccess,
					duration: 2
				})

                this.password = ""

				setTimeout(function(){
					// this.$router.go(-1)
        			navigator.pop({
        			    animated: "true"
        			}, event => {
        			    console.log('callback: ', event)
        			})
				}, 200)
			},

			closeConfirmPop() {
                this.isConfirmShow = false
			},
			closeChooseAccountPop() {
				this.ischooseAccountShow = false
			},
			closeTransferPop() {
				this.password = ""
				this.istransferShow = false
			},

		}
	}
</script>

<style scoped >
.body {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 1;
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
		padding: 60px 40px 40px 40px;	
	}
    .account-name {
        padding: 20px 0;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid;
        /* margin-bottom: 10px; */
    }
    .account-name-title {
        font-size: 36px;
        margin-bottom: 20px;
        color: #1E90FF;
    }
    .open-key-box {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .choice-box {
        background-color: #e6fef1;
        font-size: 32px;
        color: #1E90FF;
        width: 100px;
        align-items: center;
        text-align: center;
        justify-content: center;
        line-height: 50px;
        height: 50px;
    }
	.password-item {
        /* flex-direction: row;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        justify-content: space-between; */
        /* margin-bottom: 20px; */
        /* padding: 0 10px;	 */

		margin: 30px 0;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 

    }
	.password {
		font-size: 32px;
        padding: 0 0 0 10px;
        outline: none;
		height: 80px;

	}
	.password1 {
		font-size: 32px;
        padding: 0 0 0 10px;
        outline: none;

	}
	.tips {
		flex-direction: row;
		height: 60px;
		align-items: center;
	}
	.tips-left {
		color: #1E90FF;
		font-size: 28px;
        padding: 10px 0;
        width: 350px;
        align-content: center;
        text-align: center;
        background-color: #e6fef1;
	}
	.tips-right {
		color: #1E90FF;
		font-size: 32px;
	}
	.btn-box {
		margin-top: 50px;
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
    .tips {
        padding: 0 10px;
        font-size: 32px;
        letter-spacing: 2px;
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
        font-size: 32px;
        text-align: center;
    }
    .scroller {
        height: 680px;
    }

	.pop-middle-item2 {
		height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 0 10px;
	}

	.middle-top {
		margin:40px 0;
	}

	.pop-middle-item3 {
		height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 0 10px;
	}

	.pop-middle-item3-left {
		font-size: 32px;
		color: gray;
		margin-right: 20px;
	}

	.pop-middle-item3-right {
		font-size: 32px;
		margin-right: 20px;
	}

	.cost-box {
		background-color: #e6fef1;
		margin-top: 20px;
		padding: 20px;
	}

	.cost-box-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 10px 10px;
	}

	.cost-box-item-top-left {
		font-size: 32px;
		font-weight: bold;
	}

	.cost-box-item-top-right {
		font-size: 32px;
		color: #1E90FF;
		font-weight: bold;
	}

	.cost-box-item-text {
		font-size: 28px;
		color: gray;
	}

	.content {
		align-items: center;
		justify-content: center;	
	}
	.content-title {
		padding: 40px 0 10px 0;
		font-size: 36px;
		font-weight: bold;
	}

	.content-title-tips {
		padding: 0 0 40px 0;
		font-size: 32px;
		color: gray;
	}
	.qrcode-box {
		top: 20px;
		background: linear-gradient(to left, #f00, #f00) left top no-repeat, 
					linear-gradient(to bottom, #f00, #f00) left top no-repeat, 
					linear-gradient(to left, #f00, #f00) right top no-repeat,
					linear-gradient(to bottom, #f00, #f00) right top no-repeat, 
					linear-gradient(to left, #f00, #f00) left bottom no-repeat,
					linear-gradient(to bottom, #f00, #f00) left bottom no-repeat,
					linear-gradient(to left, #f00, #f00) right bottom no-repeat,
					linear-gradient(to left, #f00, #f00) right bottom no-repeat;	
		background-size: 20px 80px, 80px 20px, 20px 80px, 80px 20px;
		border-radius: 20px; 
		width: 500px;
		height: 500px;
		align-items: center;
		justify-content: center;
	}
	.account {
    align-items: center;
    padding: 40px; 
}
.account-title1 {
    color: gray;
    font-size: 28px;
    padding-bottom: 10px;
}
.account-name1 {
    font-size: 32px;
    font-weight: bold;
}
</style>
