<template>
	
    <div class="main">
      	<div class="navigator">
      		<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;" @click="goBack"></image>
      		<text style="font-size: 36px; color: #1E90FF;">{{zhLan.add_permission}}</text>
      		<image src="" style="height: 60px;width: 60px"></image>
      	</div>

        <div>
            <div class="auth-box">
                <text style="line-height:100px;font-size:36px;font-weight:bold;">{{type}}</text>
                <div class="auth-box-account">
                    <text style="font-size:36px;font-weight:bold;">1</text>
                    <text style="font-size:28px;color:gray">{{zhLan.weight_threshold}}</text>
                </div>
            </div>
        </div>

        <div>
            <div class="auth-box-type">
                <text style="line-height:100px;font-size:36px;font-weight:bold;">{{zhLan.type}}</text>
                <div class="auth-box-type-right" @click="typePop">
                    <text style="font-size:36px;font-weight:bold;">{{addType == '公钥'?zhLan.pubkey:zhLan.account}}</text>
                    <image :src="`${imgSrc}right`" mode="" style="height: 36px;width: 36px; margin-left: 10px;"></image>
                </div>
            </div>
        </div>

        <div class="account-name" v-if="addType == '公钥'">
            <div class="open-key-box">
                <text class="account-name-title">{{zhLan.pubkey}}</text>
                <text class="choice-box" @click="openKeyPop">{{zhLan.select}}</text>
            </div>
            <div class="open-key-input"><textarea v-model="addPubKey" :placeholder="`${zhLan.enter_pubkey}`"  class="input-key"></textarea></div>
            
        </div>
        <div class="account-name" v-if="addType == '账号'">
            <div class="open-key-box">
                <text class="account-name-title" >{{zhLan.account}}</text>
            </div>
            <div class="item">
                <input type="text" v-model="addAcc" :placeholder="`${zhLan.enter_account}`"  class="input2"> 
                <text class="choice-box" @click="openAccPerPop">@{{addAccChar}}</text>
            </div>

        </div>

        <!-- <div class="account-name" v-if="addType == '延时'">
            <div class="open-key-box">
                <text class="account-name-title">延时</text>
            </div>
            
            <div class="item">
                <input type="text" v-model="openKey"   class="input2"> 
                <text class="choice-box" @click="openKeyPop">秒</text>
            </div>

        </div> -->


        <div class="account-name">
            <div class="open-key-box">
                <text class="account-name-title">{{zhLan.weight}}</text>
            </div>
            <text class="password">{{weight}}</text>
            <!-- <input type="text" v-model="weight" placeholder="请输入权重"  class="password"> -->
        </div>

        <div class="btn-box">
			<wxc-button :text="`${zhLan.add}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirmAddPer" ></wxc-button>
		</div>


        <wxc-popup 
            :show="isTypeShow"
            @wxcPopupOverlayClicked="closeTypePop"
            pos="bottom"
            height="600">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.authority_type}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeTypePop"></image>
            </div>
            <div class="pop-middle">
                <div class="pop-middle-item" @click="changeType(0)">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.pubkey}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 28px;width: 28px;"></image>
                </div>
                <div class="pop-middle-item" @click="changeType(1)">
                    <div>
                        <text class="pop-middle-item-text"  >{{zhLan.account}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 28px;width: 28px;"></image>
                </div>
                <!-- <div class="pop-middle-item">
                    <div>
                        <text class="pop-middle-item-text"  @click="changeType(2)">延时</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 28px;width: 28px;"></image>
                </div> -->
            </div>
        </div>
        </wxc-popup>

        <wxc-popup 
            :show="isOpenKeyShow"
            @wxcPopupOverlayClicked="closeOpenKeyPop"
            pos="bottom"
            popup-color="rgb(255,255,255)"
            style="background-color:#fff"
            height="420">
            <div>
                <div class="pop-header">
                    <image :src="`${imgSrc}add`"  mode="" 
                        style="height: 45px;width: 45px; left:20px;position:absolute"
                        @click="goCreate"></image>
                    <text class="text">{{zhLan.choose_pubkey}}</text>
                    <image :src="`${imgSrc}close`"  mode="" 
                        style="height: 45px;width: 45px; right:20px;position:absolute"
                        @click="closeOpenKeyPop"></image>
                </div>
                
                <div class="pop-middle">
                    <scroller class="scroller">
                        <div class="pop-middle-item" v-for="(item,index) in accountList" @click="setOpenKey(item)">
                            <div>
                                <text class="pop-middle-item-text" >{{publicKeyFormatter(item.PublicKey)}}</text>
                            </div>
                        </div>
                    </scroller>
                </div>
            </div>
        </wxc-popup>
		
		<wxc-popup
		    :show="isChangeAccCharShow"
		    @wxcPopupOverlayClicked="closeChangeAccCharPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    height="420">
		    <div>
		        <div class="pop-header">
		            <image :src="`${imgSrc}add`"  mode="" 
		                style="height: 45px;width: 45px; left:20px;position:absolute"
		                @click="goCreate"></image>
		            <text class="text">{{zhLan.choose_account_actor}}</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeChangeAccCharPop"></image>
		        </div>
		        
		        <div class="pop-middle">
		            <scroller class="scroller">
		                <div class="pop-middle-item" v-for="(item,index) in newAccPers" @click="setAccChar(item)">
		                    <div>
		                        <text class="pop-middle-item-text" >{{item}}</text>
		                    </div>
		                </div>
		            </scroller>
		        </div>
		    </div>
		</wxc-popup>
		
		
		<wxc-popup
		    :show="isConfirmDetailShow"
		    @wxcPopupOverlayClicked="closeConfirmDetailPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    height="520">
		    <div>
		        <div class="pop-header">
		            <text class="text">{{zhLan.add_permission}}</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeConfirmDetailPop"></image>
		        </div>
		        
		        <div>
		            <div class="pop-account">
						<text class="pop-account-text">{{account.account_name}} @{{type}}</text>
					</div>
					<div class="pop-new">
						<div v-if="addType=='公钥'" class="pop-new-part1">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}keynew`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="new-text">{{publicKeyFormatter(addPubKey)}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="new-text">{{zhLan.weight}}1</text></div>
						</div>
						<div v-if="addType=='账号'" class="pop-new-part1">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}headnew`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="new-text">{{addAcc}}@{{addAccChar}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="new-text">{{zhLan.weight}}1</text></div>
						</div>
					</div>
					
					<div class="pop-butt">
						<wxc-button  :text="`${zhLan.confirm}`" :btnStyle="btnStyle" @wxcButtonClicked="confirmAddDetail" ></wxc-button>
					</div> 
		        </div>
		    </div>
		</wxc-popup>
		
		
		<wxc-popup
		    :show="istransferShow"
		    @wxcPopupOverlayClicked="closeTransferPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    :height="keyboardLength">
		    <!-- <div style="height: 600px;">
		        <div class="pop-header">
		            <text class="text">{{zhLan.trans_sign}}</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeTransferPop"></image>
		        </div>
		        
		        <div  style=" height: 500px;padding: 0 20px;">
					<div style="flex-direction:row; justify-content:center; align-items:center; margin-top:20px;">
						<text style="font-size:32px">{{account.account_name}} @{{type}}</text>
					</div>
					<div style="flex-direction:row; margin-top: 40px;margin-left: 50px;">
						<text style="font-size:32px">{{zhLan.enter}}</text>
						<text style="background-color:#1E90FF;padding:5px;font-size:32px;color:#ffffff">{{publicKeyFormatterShort(oldPermission.required_auth.keys[0].key)}}</text>
						<text style="font-size:32px">{{zhLan.ofprikey_password}}</text>
					</div>
		
					<div>
						<input type="password" 
						v-model="password" 
						return-key-type="done"
						 autofocus = "true"
						 @keyboard="keyboardChange" 
						 :placeholder="`${zhLan.this_password}`" class="acc-password">
					</div>
		
					<div>
						<text class="tips" style="padding-top:10px;margin-left: 50px;">{{zhLan.forget_password_show}}</text>
					</div>
					
					<div style="margin-top: 50px; align-items: center; height:200px">
						<wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="" @wxcButtonClicked="ensureAdd" :disabled="judgeIsDisabled"></wxc-button>
					</div>
		        </div>
		    </div> -->
			<div style="width:750px"><sign-util/></div>
		</wxc-popup>
		<div>
			<wxc-loading :show="isShow" type="default"></wxc-loading>
			<wxc-part-loading :show="isShow"></wxc-part-loading>
		</div>
		
    </div>
</template>

<style scoped>
.main {
	
    background-color:#f2f3f5;
    /* height: 100%; */
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
	/* opacity: 1; */
}
.navigator {
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

.auth-box {
    height: 150px;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}


.auth-box-type {
    height: 100px;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.auth-box-type-right {
        flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

    .account-name {
        padding: 40px;
        background-color: #fff;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid;
        margin-bottom: 10px;
    }
    .account-name-title {
        font-size: 36px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    .open-key-box {
        flex-direction: row;
        align-items: center;
        padding-bottom: 40px;
        justify-content: space-between;
    }
    .choice-box {
        background-color: #e6fef1;
        font-size: 32px;
        color: #1E90FF;
        width: 120px;
        align-items: center;
        text-align: center;
        justify-content: center;
        line-height: 50px;
        height: 50px;
    }
	.password-item {
        flex-direction: row;
 
        justify-content: space-between;
        margin-bottom: 60px;
        padding: 0 10px;	
    }
	.password {
		font-size: 32px;
        padding: 0 0 10px 20px;
        outline: none;
               border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
	}

    .item {
        flex-direction: row;
        /* justify-content: space-between; */
    }
    .input2 {
       	font-size: 32px;
        padding: 0 0 10px 20px;
        outline: none;
               border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        width: 520px;
        margin-right: 20px;
         
    }

.auth-box-account {
    align-items: center;
}
.auth-box-item-left {
    flex-direction: row;
    line-height: 100px;
}

.btn-box {
    padding-top: 50px;
	align-items: center;
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
.pop-key {
    flex-direction: row;
    justify-content: center;
    padding: 10px;
    background-color:#f2f3f5;
    align-items: center;
    height: 80px;
}
.pop-key-text {
    color: gray;
    font-size: 32px;
    letter-spacing: 2px;
}
.pop-middle {
    height: 300px;
    padding: 0 20px;
}
.pop-middle-item {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    padding: 0 10px;

}
.pop-middle-item-text {
    font-size: 32px;
}
.pop-footer {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.pop-footer-text {
    font-size: 32px;
    color: rgb(212, 5, 5);
    font-weight: bold;
}
.auth-box-top-text {
    font-size: 32px;
    color: gray;
}
.scroller{
	height: 260px;
}
.acc-password {
		font-size: 32px;
        height: 60px;
		border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        padding-bottom: 10px;
        outline: none;
		width: 650px;
		margin-left: 50px;
		margin-top: 20px;
	}
	
	.pop-account{
		align-items: center;
	}
	.pop-account-text{
		margin-top: 60px;
		margin-bottom: 25px;
		font-size: 36px;
	}
	.pop-old{
		background-color: #EEEEEE;
		align-items: center;
	}
	.pop-old-part1{
	/* 	width: 690px;
		margin-left: 30px; */
	}
	.pop-old-part1-part1{
		flex-direction: row;
		 height: 60px;
		 margin-top: 17px;
	}
	.pop-old-part1-part1-text{
		font-size: 32px
	}
	.pop-old-part1-part2{
		align-items: center;
		margin-bottom: 17px;
	}
	.pop-old-part1-part2-text{
		font-size: 32px
	}
	.pop-new{
		background-color: #f2f7fa;
		align-items: center;
	}
	.pop-new-part1{
		/* width: 400px; */
		
	}
	.pop-arrow{
		height: 60px;
		align-items: center;
	}
	.new-text{
		font-size: 32px;
		color: #1E90FF;
	}
	.pop-butt{
		margin-top: 30px;
		align-items: center;
	}
	.input-key{
		border-width:1px;
		border-color:#C0C0C0;  
		border-style:solid;  
		margin-top: 50px;
		border-radius: 10px;
		height: 120px;
		font-size: 32px;
		padding: 10px;
		padding-top: 20px;
		margin-bottom: 50px;
	}
</style>
<script>
	import {
		WxcMinibar, WxcPopup, WxcButton,WxcLoading, WxcPartLoading
    } from 'weex-ui';
    import { getStorage,imgSrc} from "./utils/config"
	import SignUtil from './sign_util'
	//import {updateAuth} from './utils/eos'
	//import {getCurrentAccountInfo,getAccountByPublicKey} from "./utils/account"
	//import { checkPassword} from "./utils/auth"
	
	//new
	import {getCurrentAccountInfo,getAccountByPublicKey} from "./utils/account_v2"
	import { checkPassword} from "./utils/auth_v2"
	import {updateAuth} from './utils/eos_v2'
	import {CheckPublicKeyValid} from './utils/base_v2'
	const animation = weex.requireModule('animation')
	const modal = weex.requireModule('modal');
	const globalLan = require('./utils/language/global')
	const storage = weex.requireModule('storage');
	const navigator = weex.requireModule('navigator')
 	const utils = require('./appUtils')
	
export default {
    components: {
		WxcMinibar, WxcPopup, WxcButton,WxcLoading, WxcPartLoading,SignUtil
	},
  data() {
      return {
          imgSrc: imgSrc,
		  isShow:false,
          isTypeShow: false,
          isOpenKeyShow: false,
		  isChangeAccCharShow:false,
		  istransferShow: false,
		  isConfirmDetailShow:false,
          typeName: "公钥",
          borderColor: "",
          borderRadius: "",
          backgroundColor:"#1E90FF",
          fontSize: '35px',
          color: "#ffffff", 
		  type:"",
		  account:"",
		  publicKey:"",
		  accountList:[],
		  addTypeList:[
			  "公钥","账号"
		  ],
		  addType:"公钥",
		  newAccount:"",
		  newPermission:{},
		  oldPermission:{},
		  password:"",
		  addAcc:"",
		  addAccChar:"active",
		  addPubKey:"",
		  newAccPers:"",
		  weight:1,
		  keyboardLength:600,
		  currentChain:"",
		  globalLan: globalLan,
		  zhLan: {},
		  modalLan:{},
		  chosedPer:"",
		  chosedPubKey:""
      }
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
            if(!this.password) {
                return true
            }
            return false
        },
    },
	async mounted() {
			let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("authority_add", lan)
			this.modalLan = await this.globalLan.lang("modal", lan)
			console.log("语言包",JSON.stringify(this.zhLan))
		},
	async created(){
		await storage.getItem("authority_add", res =>{
			console.log("获取缓存:",JSON.stringify(res))
			let authorityAddSt = JSON.parse(res.data)
			this.currentChain = authorityAddSt.chainName;
			this.type = authorityAddSt.type
		})

		this.account = JSON.parse(await getStorage("Account"));
		let allAccountList = JSON.parse(await getStorage("AccountManager_v2"))
		console.log("所有的：",JSON.stringify(allAccountList))
		
		this.accountList = allAccountList[this.currentChain]
		
		for(let i=0;i<this.account.permissions.length;i++){
			let value = this.account.permissions[i]
			if (value.perm_name == this.type ){
				this.oldPermission = value
			}
		}
		
		let account1 = JSON.parse(await getStorage("Account"));
		for(let i=0;i<account1.permissions.length;i++){
			let value = account1.permissions[i]
			if (value.perm_name == this.type ){
				this.newPermission = value
			}
		}
		
		console.log("完成",this.oldPermission)
		console.log("完成",this.newPermission)
		this.getSign()
		this.getKeyBoard()
	},
  methods: {
      goBack() {
		//   this.$router.go(-1)
			navigator.pop({
        	    animated: "true"
        	}, event => {
        	    let Steve = new BroadcastChannel('update')
        	    Steve.postMessage('我是回调啊!')
        	})
		  
      },
	  publicKeyFormatter(publicKey) {
	    return publicKey? publicKey.substring(0,18) + "..." + publicKey.substring(publicKey.length-18,publicKey.length): ""
	  },
	  publicKeyFormatterShort(publicKey) {
	    return publicKey? publicKey.substring(0,10) + "..." + publicKey.substring(publicKey.length-10,publicKey.length): ""
	  },
      addPriKey() {
        //   this.$router.push('/private_key_create')
        navigator.push({
            url: utils.getUrl('private_key_create.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
      },
	  setOpenKey(account){
	  	this.addPubKey = account.PublicKey
	  	this.isOpenKeyShow = false
	  },
	  setAccChar(item){
	  	this.addAccChar = item
	  	this.isChangeAccCharShow = false
	  },
      typePop() {
          this.isTypeShow = true
      },
      closeTypePop () {
        this.isTypeShow = false;
      },
      openKeyPop () {
        this.isOpenKeyShow = true;
      },
      closeOpenKeyPop () {
          this.isOpenKeyShow = false
      },
	  closeTransferPop () {
	      this.istransferShow = false
	  },
	  closeChangeAccCharPop(){
	  		  this.isChangeAccCharShow = false
	  },
	  closeConfirmDetailPop(){
	  		  this.isConfirmDetailShow = false
	  },
      changeType(e) {
		  this.addType = this.addTypeList[e]
		  this.isTypeShow = false
      },
	  keyboardChange(e){
		  if(e.isShow){
			  this.keyboardLength = 1200
		  }else{
			  this.keyboardLength = 600
		  }
	  },
	  openSign(){
	  	  let signData = {accountName:this.account.account_name,chainName:this.currentChain}
	  	  storage.setItem("to_sign", signData)
	  	  this.istransferShow = true
	  },
	  getSign(){
	  		  let that = this
	  		  let getSign = new BroadcastChannel('sign_to')
	  		  getSign.onmessage = function (event) {
	  		    console.log("接收到监听",event.data) // Assemble!
	  			let signData = event.data
	  			that.istransferShow = false
	  			that.chosedPer = signData.permission
	  			that.chosedPubKey = signData.pubkey
	  			that.password = signData.password
	  			that.ensureAdd()
	  		  }
	  	  },
	  getKeyBoard(){
		  let that = this
		  let keyboard = new BroadcastChannel('keyboard')
		  keyboard.onmessage = function (event) {
		   console.log("接收到监听",event.data) // Assemble!
		   let keyBoard = event.data
		   if(keyBoard.show){
			   that.keyboardLength = 1200
		   }else{
			   that.keyboardLength = 600
		   }
		 	  	
		  }
	  },
	  async confirmAddPer(){
		  console.log("不会吧")
		  //校验输入
		  if(this.addType == "公钥"){
			  let result = await CheckPublicKeyValid(this.addPubKey)
			   console.log("公钥检查结果：",result)
			  if(result.length == 0){
			  		modal.toast({
			  		    message: this.modalLan.plsenter_correct_pubkey,
			  		    duration: 2
			  		})
			  		return
			  }
		  }
		  if(this.addType == "账号"){
			  		  console.log("账号:",this.currentChain)
		  			  let result = await getCurrentAccountInfo(this.addAcc,this.currentChain)
					  console.log("add",JSON.stringify(result))
		  			  if(JSON.stringify(result) == '{}'){
		  			  		modal.toast({
		  			  		    message: this.modalLan.plsenter_correct_account,
		  			  		    duration: 2
		  			  		})
		  			  		return
		  			  }
		  }
		  this.isConfirmDetailShow = true
	  },
	  confirmAddDetail(){
				this.password = ""
	  		  this.isConfirmDetailShow = false
			  this.openSign()
	  		  //this.istransferShow = true
	  },
	  //获取账户信息
	  async openAccPerPop(){
		  console.log("获取账户信息,jinru")
	  		  let account = this.addAcc
	  		  if(account == ''){
	  			  modal.toast({
	  			      message: this.modalLan.account_isnull,
	  			      duration: 2
	  			  })
	  			  return
				}
				console.log("获取账户信息",account,this.currentChain)
				let result = await getCurrentAccountInfo(account,this.currentChain)
				console.log("获取账户信息")
	  		  if(JSON.stringify(result) == "{}") {
	  		      modal.toast({
	  		          message: this.modalLan.account_notexist,
	  		          duration: 2
	  		      })
	  		      return
	  		  }
	  		  
	  		  console.log("fanhui",JSON.stringify(result))
	  		  let newAccPers = []
	  
	  		  if( result.permissions.length > 1) {
	  		      for (let index = 0; index < result.permissions.length; index++) {
	  				  newAccPers.push(result.permissions[index].perm_name)
	  		      }
	  		  } else {
	  			  newAccPers.push("active")
	  		  }
	  		  this.newAccPers = newAccPers
	  		  this.isChangeAccCharShow = true
	  },
	  async ensureAdd(){
		  console.log("检查密码的参数:",this.chosedPubKey,this.currentChain,this.password)
		  let validPwd = await checkPassword(this.chosedPubKey,this.currentChain,this.password)
		  if(!validPwd){
			  console.log("密码不匹配")
			  modal.alert({
			    message: this.modalLan.password_notmatch,
			    okTitle: this.modalLan.confirm
			  }, function () {
			    console.log('alert callback')
			  })
			  return
		  }
		  
	  		  //要账户名称，权限名称，公钥，密码
			  this.addAuth(this.account.account_name,this.chosedPer,this.chosedPubKey,this.password)
	  },
	  async addAuth(accountName,choosePer,choosePubKey,password){	 
		  this.isShow = true
		  for(let i=0;i<2;i++){
			  switch (this.addType) {
			  		      case '公钥':
			  				let key = {key:this.addPubKey,weight:this.weight}
							if(i == 0){
								this.newPermission.required_auth.keys.unshift(key)
								
							}
			  				
							if(i == 1){
								this.newPermission.required_auth.keys.splice(0,1)
								this.newPermission.required_auth.keys.push(key)
							}
							console.log("次数",i,this.newPermission)
			  		        break;
			  			  case '账号':
			  			    let account1 = {permission:{actor:this.addAcc,permission:this.addAccChar},weight:this.weight}
			  				if(i == 0){
								this.newPermission.required_auth.accounts.push(account1)
							}
							
							if(i == 1){
								this.newPermission.required_auth.accounts.splice(this.newPermission.required_auth.accounts.length-1,1)
								this.newPermission.required_auth.accounts.unshift(account1)
							}
						  break;
			  		      default:
			  				this.isShow = false
			  				return
			  		        break;
			  		    }
			  			
			  		  
			  	  let form = {
			  			requiredAuth:this.newPermission.required_auth,
			  			password:password, //用户选
			  			publicKey:choosePubKey,//用户选
			  			accountName:accountName,
			  			choosePermission:choosePer,
			  			permission:this.newPermission.perm_name,//用户选
			  			permissionParent:this.newPermission.parent,
						chainName:this.currentChain
			  	  }
			  			
			  	  let result = await updateAuth(form)
			  	  if(result){
			  	    modal.toast({
			  	    	'message': this.modalLan.add_success,
			  	    	'duration': 1
			  	    });
			  			setTimeout(()=>{   //设置延迟执行
			  			    // this.$router.go(-1)
        					// navigator.pop({
        					//     animated: "true"
        					// }, event => {
        					//     console.log('callback: ', event)
        					// })
							this.goBack()
			  			},1000);
					return
			  	  }else{
			  	    if(i == 1){
						modal.alert({
						  message: this.modalLan.autihrity_addfail,
						  okTitle: this.modalLan.confirm
						}, function () {
						})
					}
			  	  }	
				  if(i == 1){
					  this.isShow = false
					  return  
				  }
			  		  
			  }
		  }
		  
  }
};
</script>