<template>
<div class="body" ref="create1">
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF;" >{{zhLan.create_account}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
	<div class="main">
		<div>
			<div class="account-name">
				<text class="account-name-title">{{zhLan.account_name}}</text>
				<input type="text" @blur="closeInput" ref="accountInput" v-model="accountName" :placeholder="`${zhLan.account_tips}`"  class="password" maxlength="12">
			</div>

			<!-- 选择公链 -->
        	<div class="account-name">
        	    <div class="open-key-box">
        	        <text class="account-name-title">{{zhLan.select_chain}}</text>
        	        <text class="choice-box" @click="openChainPop" style="margin-bottom: 20px;">{{zhLan.select}}</text>
        	    </div>

				<!-- <div type="text" style="height:45px"  @click="openChainPop" placeholder="请选择公链" class="password">{{selectedChainName}}</div> -->
				<input type="text" v-model="selectedChainName" readonly="readonly" :placeholder="`${zhLan.select_chain_tip}`" class="password">
			</div>

            <div class="account-name" v-if="OAA">
                <div class="open-key-box">
                    <text class="account-name-title">owner {{zhLan.and}} active {{zhLan.pubkey}}</text>
                    <text class="choice-box" @click="openPop(0)" style="margin-bottom: 20px;">{{zhLan.select}}</text>
                </div>
				
				<input ref="accountInput1" type="text" v-model="ownerPubKey" :placeholder="`${zhLan.enter_pubkey}`"  class="password">
			</div>

            <div class="account-name" v-if="!OAA">
                <div class="open-key-box">
                    <text class="account-name-title">owner {{zhLan.pubkey}}</text>
                    <text class="choice-box" @click="openPop(1)">{{zhLan.select}}</text>
                </div>
				
				<input ref="accountInput2" type="text" v-model="ownerPubKey" :placeholder="`${zhLan.enter_pubkey}`"  class="password">
			</div>

            <div class="account-name" v-if="!OAA">
                <div class="open-key-box">
                    <text class="account-name-title">active {{zhLan.pubkey}}</text>
                    <text class="choice-box" @click="openPop(2)">{{zhLan.select}}</text>
                </div>
				<input ref="accountInput3" type="text" v-model="activePubKey" :placeholder="`${zhLan.enter_pubkey}`"  class="password">
			</div>
		</div>
        
		<div class="tips1" v-if="OAA">
			<text class="tips-left" @click="toNoOAA">{{zhLan.part_set}}owner {{zhLan.and}} active{{zhLan.pubkey}}</text>
		</div>
		
		<div class="btn-box">
			<wxc-button size="big" :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="submit" :disabled="judgeIsDisabled"></wxc-button>
		</div>
				<!-- <div class="btn-box">
			<wxc-button size="big" text="确定"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="submit1" ></wxc-button>
		</div> -->
	</div>

	<wxc-dialog :title="`${zhLan.ple_confirm}`"
                :content="`${zhLan.confirm_content}`"
                :show="showDialog"
                :single="false"
                :is-checked="false"
				@wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
    </wxc-dialog>
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
                <text class="text">{{zhLan.select_chain}}</text>
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

    <wxc-popup 
        :show="isBottomShow"
        @wxcPopupOverlayClicked="closePop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="600">
        <div>
            <div class="pop-header">
                <image src=""  mode="" 
                    style="height: 45px;width: 45px; left:20px;position:absolute"></image>
                <!-- <image :src="`${imgSrc}add`"  mode="" 
                    style="height: 45px;width: 45px; left:20px;position:absolute"
                    @click="goCreate"></image> -->
                <text class="text">{{zhLan.choose_pubkey}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closePop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller" v-if="selectedChainName != ''">
                    <div class="pop-middle-item" @click="setPublicKey(item)" v-for="(item, index) in publicKeys" :key="index">
                        <div>
                            <text class="pop-middle-item-text">{{publicKeyFormatter(item)}}</text>
                        </div>
                    </div>
                </scroller>
				<div v-if="selectedChainName == ''" style="align-items: center;margin-top: 15px;"><text style="font-size: 32px;">请先选择公链</text></div>
				
            </div>
        </div>
    </wxc-popup>


	<wxc-popup 
        :show="isCreateShow"
        @wxcPopupOverlayClicked="closeCreatePop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="320">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.create_way}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeCreatePop"></image>
            </div>
            
            <div class="pop-middle">               
                    <div class="pop-middle-item2" @click="createByself">
						<text class="pop-middle-item-text">{{zhLan.create_self}}</text>
						<wxc-icon name="more"></wxc-icon>
                    </div>
					<div class="pop-middle-item2" @click="createByOther">
						<text class="pop-middle-item-text">{{zhLan.create_other}}</text>
						<wxc-icon name="more"></wxc-icon>
                    </div>
           
            </div>
        </div>
    </wxc-popup>

	<!-- 账号信息确认dialog -->
	<wxc-popup 
        :show="isConfirmShow"
        @wxcPopupOverlayClicked="closeConfirmPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="880">
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
							<text class="cost-box-item-top-right">{{totalPrice}} {{selectedChainName}}</text>
						</div>
						<div  class="cost-box-item">
							<text class="cost-box-item-text">{{zhLan.ram}} {{Math.round(ram/1024)}} KB</text>
							<text class="cost-box-item-text">{{ramPrice}} {{selectedChainName}}</text>
						</div>
						<div  class="cost-box-item">
							<text class="cost-box-item-text">{{zhLan.other_fee}}</text>
							<text class="cost-box-item-text">0.0004 {{selectedChainName}}</text>
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
	<!-- 选择操作账号 -->
	<wxc-popup 
        :show="ischooseAccountShow"
        @wxcPopupOverlayClicked="closeChooseAccountPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="600">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.choose_act_account}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeChooseAccountPop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller">
					<div v-for="(account,index) in actAccounts" :key="index">
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
        <!-- <div>
            <div class="pop-header">
                <text class="text">{{tran_sign.trans_sign}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeTransferPop"></image>
            </div>
            
            <div class="pop-middle">
				<div class="middle-top">
					<div style="justify-content:center; align-items:center;">
						<text style="font-size:32px;">{{creator}} @{{creatorPermission}}</text>
					</div>
				</div>

				<div style="flex-direction:row;">
					<text style="font-size:32px;">{{tran_sign.enter}}</text>
					<text style="background-color:#1E90FF;padding:5px;font-size:32px;;color:#ffffff">{{publicKeyFormatter3(creatorPubkey)}}</text>
					<text style="font-size:32px;">{{tran_sign.ofprikey_password}}</text>
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
        </div> -->
		<div style="width:750px"><sign-util/></div>
    </wxc-popup>

	<wxc-mask height="800"
              width="702"
              border-radius="0"
              duration="200"
              mask-bg-color="#FFFFFF"
              :has-animation="true"
              :has-overlay="true"
              :show-close="true"
              :show="isQrcodeShow"
              @wxcMaskSetHidden="closeQrcodePop">
            <div class="content">
                <text class="content-title">{{zhLan.need_help}}</text>
				<text class="content-title-tips">{{zhLan.use_this}}</text>
                <div  class="qrcode-box">
					<div style="width:400px;height:400px">
						<weex-qrcode :text="qrText" :cell="qrCell"></weex-qrcode>
                	</div>
				</div>
                    
                <div class="account">
                    <text class="account-title1">{{zhLan.account_name}}</text>
                    <text class="account-name1">{{accountName}}</text>
                </div>
            </div>
    </wxc-mask>
	<wxc-loading :show="isShow" type="default" :need-mask="true" ></wxc-loading>
	
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, WxcLoading,Utils} from 'weex-ui';
	import { checkPassword} from "./utils/auth_v2"
	import { imgSrc, getStorage, chainList } from "./utils/config_v2";
	import { createNewAccount, getRamPrice } from './utils/eos_v2' 
	import { getCurrentAccountInfo, switchAccount, addLocalAccount } from './utils/account_v2'
	import {CheckPublicKeyValid} from './utils/base_v2'
	const { Api, JsonRpc } = require('eosjs');
	const modal = weex.requireModule('modal')
	const storage = weex.requireModule('storage')
	const animation = weex.requireModule('animation')
	const navigator = weex.requireModule('navigator')
	const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	import WeexQrcode from 'weex-qrcode'
	import SignUtil from "./sign_util"
	export default {
		components: { WxcButton,WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, WeexQrcode, WxcLoading,SignUtil },
		data() {
			return {
				imgSrc: imgSrc,
                OAA: true,
				isBottomShow: false,
				isCreateShow: false,
				isConfirmShow: false,
				ischooseAccountShow: false,
				istransferShow: false,
				isQrcodeShow: false,
				showDialog: false,
				comformShort: false,
				showChainSelectPop:false,
				selectedChainName:'',
				width: "100%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
                color: "#ffffff", 
                openKey:"",
				accountName: "",
				ownerPubKey: "",
				activePubKey: "",
				pubKeyType: 1,
				accounts: [],
				actAccounts:[],
				password: "",
				creator: '',
				creatorPubkey: '',
				creatorPermission: '',
				ram: 2996,
				ramPrice: 0,
				totalPrice:0,

				qrText: '',
				qrCell: 400,
				isShow: false,
				popH: 600,
				chains:[],
        		globalLan:globalLan,
				zhLan:{},
				modelLan:{},
				tran_sign:{},
        		currentLan: '',
				publicKeys:[],
				inputPubkeyIndex:0
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

            },
		},
		beforeCreate() {

		},
		async created() {
    		//语言包
    		let lan = await getStorage('lan')
			let zhLan = {}
			let modelLan = {}
			let tran_sign = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		}
    		if(lan == 'en-US') {
    		  this.currentLan = "English"
    		}else {
    		  this.currentLan = '简体中文'
    		}	
			this.zhLan = await this.globalLan.lang("create_account", lan)
			this.modelLan = await this.globalLan.lang("modal", lan)
			this.tran_sign = await this.globalLan.lang("tran_sign", lan)
	
			//获取公链列表
			this.chainList = chainList

			let param = JSON.parse(await getStorage("create_account"))
			if(param.publicKey){
				this.OAA = true,
            	this.ownerPubKey = param.publicKey;
            	this.activePubKey = param.publicKey;
			}

			this.ramPrice = Math.ceil((await getRamPrice(this.ram/1024)) *10000) /10000
			this.totalPrice = (this.ramPrice*10000+4) / 10000
			console.log(this.totalPrice)
			this.accounts = JSON.parse(await getStorage("AccountManager_v2"))
			console.log("this.accounts: ", this.accounts)
			this.getSign()
			this.getKeyBoard()
		},
		mounted() {
			var testEl = this.$refs.create1;
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
			popKeyBoard(e) {
				console.log("弹出输入框")
				console.log(e)
				if(e.isShow) {
					this.popH = 600 + e.keyboardSize + 100
				}else {
					this.popH = 600
				}
			},
			selectChainName(chainName) {
				this.selectedChainName = chainName;
				this.showChainSelectPop = !this.showChainSelectPop;
				this.actAccounts = this.accounts[chainName];
				console.log("this.accounts[chainName]: ", this.accounts[chainName])
				this.publicKeys = []
				this.accounts[chainName].forEach(pubkeyObj => {
					if(this.publicKeys.indexOf(pubkeyObj.PublicKey) == -1){
						this.publicKeys.push(pubkeyObj.PublicKey);	
					}			
				});
				this.publicKeys.forEach(sinPubKey => {
					if(this.publicKeys.indexOf(sinPubKey) !=-1 ){
						this.publicKeys.slice(this.publicKeys.indexOf(sinPubKey),1)
					}
				})

				console.log("publicKeys: ", this.publicKeys)
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
			setPublicKey(key) {
				if(this.OAA) {
					this.ownerPubKey = key
					this.activePubKey = key
				}else {
					if(this.pubKeyType == 1) {
						this.ownerPubKey = key
					}else {
						this.activePubKey = key
					}
				}
				this.isBottomShow = false
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
				//this.istransferShow = true
				this.openSign()
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
			wxcDialogCancelBtnClicked() {
				this.showDialog = false
			},
			wxcDialogConfirmBtnClicked() {
				this.comformShort = true
				this.showDialog = false
				this.submit()
			},
			async submit() {
				if(this.$refs["accountInput"]){
					this.$refs["accountInput"].blur()
				}
				if(this.$refs["accountInput1"]){
					this.$refs["accountInput1"].blur()
				}
				if(this.$refs["accountInput2"]){
					this.$refs["accountInput2"].blur()
				}
				if(this.$refs["accountInput3"]){
					this.$refs["accountInput3"].blur()
				}
		
				var j =  /^[1-5a-z]+$/

				if(this.OAA) {
					this.activePubKey = this.ownerPubKey
				}

				if (this.accountName == "") {
					modal.toast({
						message: this.modelLan.accountname_notnull,
						duration: 2
					})
					return					
				}

				if (!j.test(this.accountName)){
					modal.toast({
						message: this.modelLan.accountname_rex,
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
						message: this.modelLan.account_toosimple,
						duration: 2
					})
					return
				}

				if (!this.activePubKey || !this.ownerPubKey) {
					modal.toast({
						message: this.modelLan.enter_pubkey,
						duration: 2
					})
					return					
				}
				
				//start check the public key here
				let actResult = await CheckPublicKeyValid(this.activePubKey)
				console.log("接受结果",actResult)
				if(!actResult){
					modal.toast({
						message: "请输入正确的公钥",
						duration: 2
					})
					return	
				}
				let ownResult = await CheckPublicKeyValid(this.ownerPubKey)
				if(!ownResult){
					modal.toast({
						message: "请输入正确的公钥",
						duration: 2
					})
					return	
				}
				
				
				let account = await getCurrentAccountInfo(this.accountName, this.selectedChainName)
				console.log("获取到链上账号信息：", JSON.stringify(account))
				if(JSON.stringify(account) != "{}") {
					modal.toast({
						message: this.modelLan.account_exist,
						duration: 2
					})
					return	
				}				

				this.isCreateShow = true


			},
			openSign(){
				let signData ={accountName:this.creator,chainName:this.selectedChainName}
				storage.setItem("to_sign", signData)
				this.istransferShow = true //页面放入弹出框的状态
			},
			getSign(){
			  let that = this
			  let getSign = new BroadcastChannel('sign_to')
			  getSign.onmessage = function (event) {
			    console.log("接收到监听",event.data) // Assemble!
				let signData = event.data
			    console.log("接收到签名返回",signData.pubkey)
				that.isEnsureShow = false
				that.creatorPermission = signData.permission
				that.creatorPubkey = signData.pubkey
				that.password = signData.password
				that.ensureTransfer()
			  }
			},
			getKeyBoard(){
				  let that = this
				  let keyboard = new BroadcastChannel('keyboard')
				  keyboard.onmessage = function (event) {
				   console.log("接收到监听",event.data) // Assemble!
				   let keyBoard = event.data
				   if(keyBoard.show){
					   that.popH = 1200
				   }else{
					   that.popH = 600
				   }
				 	  	
				  }
				},
			// 输入密码确认交易
			async ensureTransfer() {
				this.isShow = true
				this.istransferShow = false
				let validPwd = await checkPassword(this.creatorPubkey,this.selectedChainName,this.password)
                if(!validPwd){
					this.isShow = false
                    modal.toast({
                        message: this.modelLan.password_notmatch,
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
					symbols: this.selectedChainName,
					permission: this.creatorPermission,
					ramBytes: this.ram,
				}

				let message = await createNewAccount(form, this.selectedChainName)
				console.log("账号创建标识："+JSON.stringify(message))
				if(JSON.stringify(message) == "{}") {
					this.isShow = false
					modal.toast({
						message: this.modelLan.account_createfail,
						duration: 2
					})
					
					return 
				}

				if(this.ownerPubKey == this.activePubKey){
					let isexit = await this.saveToStorageOA()
					if(isexit) {
						console.log("开始切换账号")
						for(let i = 0; i < 10; i++) {
							let res = await switchAccount(this.accountName, this.activePubKey, this.selectedChainName)
							if(res) {
								console.log("切换账户成功")
								break
							}
						}
					}
				} else {
					let isOwnerExit = await this.saveToStorageONA(this.ownerPubKey, "owner")

					let isActiveExit = await this.saveToStorageONA(this.activePubKey, "active")

					if((isOwnerExit && isActiveExit) || isActiveExit) {
						console.log("开始切换账号")
						for(let i = 0; i < 10; i++) {
							let res = await switchAccount(this.accountName, this.activePubKey, this.selectedChainName)
							if(res) {
								console.log("切换账户成功")
								break
							}
						}
					} else if(isOwnerExit && !isActiveExit) {
						console.log("开始切换账号")
						for(let i = 0; i < 10; i++) {
							let res = await switchAccount(this.accountName, this.ownerPubKey, this.selectedChainName)
							if(res) {
								console.log("切换账户成功")
								break
							}
						}
					}
				}
				
				this.isShow = false
				modal.toast({
					message: this.modelLan.account_createsuccess,
					duration: 2
				})
        		const lanSet = new BroadcastChannel('account_refresh')
				lanSet.postMessage('refresh')
				
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},


			goCreate() {
				navigator.push({
        		    url: utils.getUrl('private_key_create.js'),
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},
			closeInput(){
				console.log('失去焦点')
			},
			// 公钥选择dialog
            openPop(item) {
				if(this.$refs["accountInput"]){
					this.$refs["accountInput"].blur()
				}
				if(this.$refs["accountInput1"]){
					this.$refs["accountInput1"].blur()
				}
				if(this.$refs["accountInput2"]){
					this.$refs["accountInput2"].blur()
				}
				if(this.$refs["accountInput3"]){
					this.$refs["accountInput3"].blur()
				}
				console.log("打开弹窗1")
				this.pubKeyType = item
						
				this.isBottomShow = true
			},
			openChainPop(){	
				if(this.$refs["accountInput"]){
					this.$refs["accountInput"].blur()
				}
				if(this.$refs["accountInput1"]){
					this.$refs["accountInput1"].blur()
				}
				if(this.$refs["accountInput2"]){
					this.$refs["accountInput2"].blur()
				}
				if(this.$refs["accountInput3"]){
					this.$refs["accountInput3"].blur()
				}					
				this.showChainSelectPop = !this.showChainSelectPop;
			},
            closePop() {
                this.isBottomShow = false
			},
			closeChainSelectPop() {
				this.showChainSelectPop = !this.showChainSelectPop;
			},
            toNoOAA() {
                this.OAA = !this.OAA
			},

			// 创建方式dialog
			openCreatePop() {
                this.isCreateShow = true
            },
            closeCreatePop() {
                this.isCreateShow = false
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
			closeQrcodePop() {
				this.isQrcodeShow = false
			},
			createByself() {
				this.isCreateShow = false
				this.isConfirmShow = true
			},

			createByOther() {
				this.isCreateShow = false
				let qrText = "createAccount&"+this.accountName+'&'+this.ownerPubKey+'&'+this.activePubKey+'&'+this.selectedChainName
				console.log("0820 qrText: ", qrText)
        		this.qrText = qrText
				this.isQrcodeShow = true
			},

			// owner 和 active公钥 相同
			async saveToStorageOA() {
				console.log("公钥相同开始保存")
				let isExit = false
				for (let i = 0; i < this.accounts[this.selectedChainName].length; i++) {
					if(this.accounts[this.selectedChainName][i].PublicKey == this.ownerPubKey) {
						isExit = true
						break
					}
				}

				if (isExit) {
					// 构建账号信息数据
					console.log("找到该账户")
					let currency = []
					currency.push(this.selectedChainName)
					let account = {
						PublicKey: this.ownerPubKey,
						Accounts: [{	
							Account: this.accountName,
							Permission: ["owner","active"],
							Currency : currency
						}]	
					}

					console.log("account: "+JSON.stringify(account))
					// 账号信息保存到本地
					await addLocalAccount(account, this.selectedChainName)
				}
				return isExit
			},

			// owner 和 active 公钥不相同
			async saveToStorageONA(publicKey, type) {
				console.log("公钥不同开始保存",this.accounts)
				let isExit = false
				for (let i = 0; i < this.accounts[this.selectedChainName].length; i++) {
					if(this.accounts[this.selectedChainName][i].PublicKey == publicKey) {
						isExit = true
						break
					}
				}

				if (isExit) {
					// 构建账号信息数据
					let currency = []
					currency.push(this.selectedChainName)
					let account = {
						PublicKey: publicKey,
						Accounts: [{	
							Account: this.accountName,
							Permission: [type],
							Currency : currency
						}]	
					}
					// 账号信息保存到本地
					await addLocalAccount(account, this.selectedChainName)
				}

				return isExit
			
			}
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
        padding: 20px 0 0 0;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid;
        margin-bottom: 10px;
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
        font-size: 28px;
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
		/* font-size: 28px;
        padding: 0 0 0 10px;
        outline: none; */
		font-size: 32px;
        padding: 0 0 10px 20px;
        outline: none;
		/* width: 600px; */
	}
	.tips1 {
		flex-direction: row;
		height: 60px;
		
		align-items: center;
	}
	.tips-left {
		color: #1E90FF;
		font-size: 28px;;
        padding: 10px 0;
        width: 400px;
        align-content: center;
        text-align: center;
        background-color: #e6fef1;
	}
	.tips-right {
		color: #1E90FF;
		font-size: 28px;
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
        font-size: 28px;
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
        font-size: 28px;
        text-align: center;
    }
    .scroller {
        height: 520px;
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
		font-size: 28px;
		color: gray;
		margin-right: 20px;
	}

	.pop-middle-item3-right {
		font-size: 28px;
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
		font-size: 28px;
		font-weight: bold;
	}

	.cost-box-item-top-right {
		font-size: 28px;
		color: #1E90FF;
		font-weight: bold;
	}

	.cost-box-item-text {
		font-size: 28px;;
		color: gray;
	}

	.content {
		align-items: center;
		justify-content: center;	
	}
	.content-title {
		padding: 40px 0 10px 0;
		font-size: 32px;
		font-weight: bold;
	}

	.content-title-tips {
		padding: 0 0 40px 0;
		font-size: 28px;
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
    font-size: 28px;;
    padding-bottom: 10px;
}
.account-name1 {
    font-size: 28px;
    font-weight: bold;
}
</style>
