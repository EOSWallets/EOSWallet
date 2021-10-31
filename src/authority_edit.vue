<template>
    <div >
		<div class="navigator" v-if="!isDeleteShow">
			<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF;">{{zhLan.alter_permission}}</text>
			<image src="" style="height: 60px;width: 60px"></image>
		</div>
		<div class="navigator" v-if="isDeleteShow">
			<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF;">{{zhLan.alter_permission}}</text>
			<text style="font-size: 28px; color: #88291d;" @click="deletePer">{{zhLan.delete}}</text>
		</div>

        <div>
            <div class="auth-box">
                <text style="line-height:100px;font-size:36px;font-weight:bold;">{{type}}</text>
                <div class="auth-box-account">
                    <text style="font-size:36px;font-weight:bold;">{{weight}}</text>
                    <text style="font-size:28px;color:gray">{{zhLan.weight_threshold}}</text>
                </div>
            </div>
        </div>

        <div class="account-name" v-if="edit == 'pubKey'">
            <div class="open-key-box">
                <text class="account-name-title">{{zhLan.pubkey}}</text>
                <text class="choice-box" @click="openKeyPop">{{zhLan.select}}</text>
            </div>
            
            <textarea v-model="changePubKey" :placeholder="`${zhLan.enter_pubkey}`"  class="prikey"/>
        </div>
		
		<div class="account-name" v-if="edit == 'account'">
		    <div class="open-key-box">
		        <text class="account-name-title">{{zhLan.account}}</text> 
		    </div>
		    <div style="flex-direction: row;">
				<input type="text" v-model="changeAcc" :placeholder="`${zhLan.enter_account}`" class="input2"> 
				<text class="choice-box" @click="openAccPerPop">@{{changeAccChar}}</text>
			</div>
		</div>
		
		<!-- <div class="account-name" v-if="edit == 'threshold'">
		    <div class="open-key-box">
		        <text class="account-name-title">{{zhLan.newthreshold}}</text> 
		    </div>
		    <div style="flex-direction: row;">
				<input type="number" v-model="newThreshold" :placeholder="`${zhLan.max_threshold}${maxThreshold}`"  class="input3"> 
			</div>
		</div> -->
		

        <div class="account-name" v-if="edit != 'threshold'">
            <div class="open-key-box">
                <text class="account-name-title">{{zhLan.weight}}</text>
            </div>
            
            <input v-model="changeWeight" :placeholder="`${zhLan.enter_weight}`"  class="password">
        </div>

        <div class="btn-box">
			<wxc-button :text="`${zhLan.alter}`"  :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirmEditPer" ></wxc-button>
		</div>  

        <wxc-popup 
			v-if="edit == 'pubKey'"
            :show="isOpenKeyShow"
            @wxcPopupOverlayClicked="closeOpenKeyPop"
            pos="bottom"
            popup-color="rgb(255,255,255)"
            style="background-color:#fff"
            height="420">
            <div>
                <div class="pop-header">
       
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
			v-if="edit == 'account'"
		    :show="isChangeAccCharShow"
		    @wxcPopupOverlayClicked="closeChangeAccCharPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    height="420">
		    <div>
		        <div class="pop-header">
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
		    height="700">
		    <div>
		        <div class="pop-header">
		            <text class="text">{{zhLan.alter_permission}}</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeConfirmDetailPop"></image>
		        </div>
		        
		        <div>
		            <div class="pop-account">
						<text class="pop-account-text">{{account.account_name}} @{{type}}</text>
					</div>
					<div class="pop-old">
						<div class="pop-old-part1" v-if="edit=='pubKey'">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}keyold`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="pop-old-part1-part1-text">{{publicKeyFormatter(oldPermission.required_auth.keys[accIndex].key)}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="pop-old-part1-part2-text">{{zhLan.weight}}1</text></div>
						</div>
						<div class="pop-old-part1" v-if="edit=='account'">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}headold`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="pop-old-part1-part1-text">{{oldPermission.required_auth.accounts[accIndex].permission.actor}}@{{oldPermission.required_auth.accounts[accIndex].permission.permission}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="pop-old-part1-part2-text">{{zhLan.weight}}1</text></div>
						</div>
					</div>
					<div class="pop-arrow">
						<image :src="`${imgSrc}arrow`"  mode=""
						    style="height: 40px;width: 40px;margin-top: 5px;"></image>
					</div>
					<div class="pop-new">
						<div v-if="edit=='pubKey'" class="pop-new-part1">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}keynew`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="new-text">{{publicKeyFormatter(changePubKey)}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="new-text">{{zhLan.weight}}1</text></div>
						</div>
						<div v-if="edit=='account'" class="pop-new-part1">
							<div class="pop-old-part1-part1">
								<image :src="`${imgSrc}headnew`"  mode=""
								    style="height: 40px;width: 40px;"></image>
								<text class="new-text">{{changeAcc}}@{{changeAccChar}}</text>
							</div>
							<div class="pop-old-part1-part2"><text class="new-text">{{zhLan.weight}}1</text></div>
						</div>
					</div>
					
					<div class="pop-butt">
						<wxc-button :text="`${zhLan.confirm}`" :btnStyle="btnStyle" @wxcButtonClicked="confirmEditDetail" ></wxc-button>
					</div> 
		        </div>
		    </div>
		</wxc-popup>
		
		
		<!-- <wxc-popup
		    :show="istransferShow"
		    @wxcPopupOverlayClicked="closeTransferPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    :height="keyboardLength">
		    <div style="height: 600px;">
		        <div class="pop-header">
		            <text class="text">{{zhLan.trans_sign}}</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeTransferPop"></image>
		        </div>
		        
		        <div  style=" height: 500px;padding: 0 20px;">
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
						<input type="password"
						 return-key-type="done"
						  autofocus = "true"
						  @keyboard="keyboardChange"
						 v-model="password" :placeholder="`${zhLan.this_password}`" class="acc-password">
					</div>
		
					<div>
						<text class="tips" style="padding-top:10px;margin-left: 50px;">{{zhLan.forget_password_show}}</text>
					</div>
					
					<div style="margin-top: 50px; align-items: center; height:200px">
						<wxc-button :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="" @wxcButtonClicked="ensureEdit" :disabled="judgeIsDisabled"></wxc-button>
					</div>
		        </div>
		    </div>
		</wxc-popup> -->
		<!-- 用户选择操作权限 -->
		<!-- <wxc-popup
		    :show="isChoosePerShow"
		    @wxcPopupOverlayClicked="closeChoosePerPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    :height="keyboardLength">
		    <div style="height: 600px;">
		        <div class="pop-header">
		            <text class="text">选择权限</text>
		            <image :src="`${imgSrc}close`"  mode="" 
		                style="height: 45px;width: 45px; right:20px;position:absolute"
		                @click="closeChoosePerPop"></image>
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
		</wxc-popup> -->
		<!-- <div style="width:750px"><sign/></div> -->
		<wxc-popup
		    :show="isChoosePerShow"
		    @wxcPopupOverlayClicked="closeChoosePerPop"
		    pos="bottom"
		    popup-color="rgb(255,255,255)"
		    style="background-color:#fff"
		    :height="keyboardLength">
			<!-- <div style="height: 100px;align-items: center;">
				<image :src="`${imgSrc}close`"  mode=""
				    style="height: 45px;width: 45px; right:20px;position:absolute"
				    @click="closeChoosePerPop"></image>
			</div> -->
		    <div style="width:750px"><source-manage-add/></div>
		</wxc-popup>
		<div>
			<wxc-loading :show="isShow" type="default"></wxc-loading>
			<!-- <wxc-part-loading :show="isShow"></wxc-part-loading> -->
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
	opacity: 1;
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
	.input3 {
	   		font-size: 32px;
	    padding: 0 0 10px 20px;
	    outline: none;
	           border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
	    width: 730px;
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
	background-color: #d2ffda;
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
	color: #00df7b;
}
.pop-butt{
	margin-top: 30px;
	align-items: center;
}


.prikey {
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
	.tips{
		font-size: 28px;
		}
</style>
<script>
	import {
		WxcMinibar, WxcPopup, WxcButton,WxcLoading, WxcPartLoading
    } from 'weex-ui';
    import { getStorage,imgSrc} from "./utils/config"
	// import {updateAuth} from './utils/eos'
	// import {getCurrentAccountInfo,getAccountByPublicKey} from "./utils/account"
	//import { checkPassword} from "./utils/auth"
	
	//new
	//import SignUtil from "./sign_util"
	import SourceManageAdd from "./sign_util"
	import {updateAuth} from './utils/eos_v2'
	import { checkPassword} from "./utils/auth_v2"
	import {getCurrentAccountInfo,getAccountByPublicKey} from "./utils/account_v2"
	const animation = weex.requireModule('animation')
	const modal = weex.requireModule('modal');
	const navigator = weex.requireModule('navigator')
	const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	const storage = weex.requireModule('storage'); 
	 
export default {
    components: {
		WxcMinibar, WxcPopup, WxcButton,WxcLoading, WxcPartLoading,SourceManageAdd
	},
  data() {
      return {
          imgSrc: imgSrc,
		  isShow: false,
          isTypeShow: false,
          isOpenKeyShow: false,
		  isChangeAccCharShow:false,
		  istransferShow: false,
		  isDeleteShow:false,
		  isConfirmDetailShow:false,
		  isChoosePerShow:false,
          typeName: "公钥",
          borderColor: "",
          borderRadius: "",
          backgroundColor:"#1E90FF",
          fontSize: '35px',
          color: "#ffffff", 
		  type:"",
		  edit:"",
		  account:"",
		  weight:1,
		  accountList:[],
		  requiredAuth:{},
		  oldRequiredAuth:{},
		  accIndex:-1,
		  password:"",
		  changeAcc:"",
		  changeAccChar:"",
		  changePubKey:"",
		  newAccPers:"",
		  newPermission:{},
		  oldPermission:{},
		  deleteText:"删除",
		  keyboardLength:"600",
		  editTitle:"修改许可",
		  maxThreshold:"",
		  newThreshold:"",
		  changeWeight:1,
		  currentChain:"",
		  globalLan: globalLan,
		  zhLan: {},
		  modalLan:{},
		  perMissList:[],
		  chosedPer:"",
		  chosedPubKey:""
      }
  },
 	async mounted() {
		 	console.log("获取语言开始",lan)
			let lan = await getStorage('lan')
			console.log("语言类型",lan)
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("authority_edit", lan)
			this.modalLan = await this.globalLan.lang("modal", lan)
			console.log("语言包",JSON.stringify(this.zhLan))
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
	async created(){
		let param = JSON.parse(await getStorage("authority_edit"))
        this.type = param.type;
        this.edit = param.edit;
        this.accIndex = param.index;
        this.currentChain = param.chainName;
		this.chosedPer = param.edit
		
		console.log("获取参数：",this.type,this.edit,this.accIndex,this.currentChain)
		let allAccountList = JSON.parse(await getStorage("AccountManager_v2"))
		// this.currentChain = allAccountList.CurrentChain
		
		let account = JSON.parse(await getStorage("Account"));
		this.accountList = allAccountList[this.currentChain]
		
		
		this.account = account
		console.log("edit",this.edit)
		for(let i=0;i<account.permissions.length;i++){
			let value = account.permissions[i]
			if (value.perm_name == this.type ){
				this.oldPermission = value
			}
		}
		//this.chosedPubKey = this.oldPermission.required_auth.keys[this.accIndex].key
		let account1 = JSON.parse(await getStorage("Account"));
		for(let i=0;i<account1.permissions.length;i++){
			let value = account1.permissions[i]
			if (value.perm_name == this.type ){
				this.newPermission = value
			}
		}
		
		console.log("老的",this.oldPermission)
		console.log("新的",this.newPermission)
		console.log("test",this.oldPermission.required_auth)
		//console.log("老的teshu",JSON.stringify(this.oldPermission.required_auth.accounts[this.accIndex].permission.actor))
		
		if (this.edit == 'pubKey'){
			this.changePubKey = this.newPermission.required_auth.keys[this.accIndex].key
		}
		
		if(this.edit == 'account'){
			this.changeAcc = this.newPermission.required_auth.accounts[this.accIndex].permission.actor
			this.changeAccChar = this.newPermission.required_auth.accounts[this.accIndex].permission.permission
		}
		
		let keysLength = this.newPermission.required_auth.keys.length
		// let accountsLength = this.newPermission.required_auth.accounts.length
		// this.maxThreshold = keysLength+ accountsLength
		
		if(this.edit == "pubKey" && keysLength > 1){
			
			this.isDeleteShow = true
		}
		if(this.edit == "account"){
			this.isDeleteShow = true
		}
		// if(this.edit == "threshold"){
		// 	this.weight = this.oldPermission.required_auth.threshold
		// 	this.editTitle = "更新阈值"
		// }
		
		console.log("执行完毕")
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
      goBackup() {
          
      },
      addPriKey() {
        navigator.push({
            url: utils.getUrl('private_key_create.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
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
	  // choosePerMiss(){
		 //  let pubKeyList = []
		 //  let perMissList = []
		 //  //获取用户导入过的公钥
		 //  for(let i=0;i<this.accountList.length;i++){
			//   console.log("获取到公钥",this.accountList[i].PublicKey)
			//   pubKeyList.push(this.accountList[i].PublicKey)
		 //  }
		 //  //获取当前账号里所有的权限
		 //  for(let i=0;i<this.account.permissions.length;i++){
			//   for(let j=0;j<this.account.permissions[i].required_auth.keys.length;j++){
			// 	  if(pubKeyList.indexOf(this.account.permissions[i].required_auth.keys[j].key) != -1){
			// 		  let per = {pubkey:this.account.permissions[i].required_auth.keys[j].key,per:this.account.permissions[i].perm_name}
			// 		  perMissList.push(per)
			// 	  }
			//   }
		 //  }
		 //  console.log("表1",pubKeyList)
		 //  console.log("表2",JSON.stringify(perMissList))
		 //  this.perMissList = perMissList
		  
		 //  // let authority = new BroadcastChannel('to_sign')
		 //  let signData = {accountName:this.account.account_name,chainName:this.currentChain}
		 //  // authority.postMessage(JSON.stringify(signData))
		 //  storage.setItem("to_sign", signData)
		  
		 //  this.isChoosePerShow = true
	  // },
	  closeChoosePerPop(){
		  this.isChoosePerShow = false
	  },
	  // locatePer(item){
		 //  this.chosedPer = item.per
		 //  // this.chosedPubKey = this.oldPermission.required_auth.keys[this.accIndex].key
		 //  this.chosedPubKey = item.pubkey
		 //  this.isChoosePerShow = false
		  
	  // },
	  openSign(){
		  let signData = {accountName:this.account.account_name,chainName:this.currentChain}
		  storage.setItem("to_sign", signData)
		  this.isChoosePerShow = true
	  },
	  getSign(){
		  let that = this
		  let getSign = new BroadcastChannel('sign_to')
		  getSign.onmessage = function (event) {
		    console.log("接收到监听",event.data) // Assemble!
			let signData = event.data
		    console.log("接收到签名返回",signData.pubkey)
			that.isChoosePerShow = false
			that.chosedPer = signData.permission
			that.chosedPubKey = signData.pubkey
			that.password = signData.password
			that.ensureEdit()
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
	  keyboardChange(e){
	  		if(e.isShow){
	  		  this.keyboardLength = 1200
	  		}else{
	  		  this.keyboardLength = 600
	  		}
	  },
	  //获取账户信息
	  async openAccPerPop(){
		  let account = this.changeAcc
		  if(account == ''){
			  modal.toast({
			      message: this.modalLan.account_isnull,
			      duration: 2
			  })
			  return
		  }
		  let result = await getCurrentAccountInfo(account,this.currentChain)
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
	  async confirmEditPer() {
		  //查询公钥或账户是否有效
		  if(this.edit == "pubKey"){
			  	console.log("查询公钥或账户是否有效")
				let result = await getAccountByPublicKey(this.changePubKey,this.currentChain)
				console.log("jieguo",result)
				if(result.length == 0){
					 modal.alert({
					   message: this.modalLan.plsenter_correct_pubkey,
					   okTitle: this.modalLan.confirm
					 }, function () {
					 })
					 return
				}
				if(this.changeWeight != 1){
					 modal.alert({
					   message: this.modalLan.authority_edit_limit1,
					   okTitle: this.modalLan.confirm
					 }, function () {
					 })
					
					 return
				}
				
		  		this.newPermission.required_auth.keys[this.accIndex].key = this.changePubKey
				this.newPermission.required_auth.keys[this.accIndex].weight = this.changeWeight
		  }
		  
		  if(this.edit == "account"){
					let result= await getCurrentAccountInfo(this.changeAcc,this.currentChain)
					if(JSON.stringify(result) == '{}'){
						
						 modal.alert({
						   message: this.modalLan.plsenter_correct_account,
						   okTitle: this.modalLan.confirm
						 }, function () {
						 })
						 return
					}
					if(this.changeWeight != 1){
					   modal.alert({
					     message: this.modalLan.authority_edit_limit1,
					     okTitle: this.modalLan.confirm
					   }, function () {
					   })
					   return
					}
					this.newPermission.required_auth.accounts[this.accIndex].permission.actor = this.changeAcc
		  			this.newPermission.required_auth.accounts[this.accIndex].permission.weight = this.changeWeight
		  }
		  if(this.edit == "threshold"){
			  if(this.newThreshold > this.maxThreshold || this.newThreshold < 1){
				  modal.alert({
				    message:  this.modalLan.now_set_max+this.maxThreshold,
				    okTitle: this.modalLan.confirm
				  }, function () {
				  })
				  return
			  }
			  this.newPermission.required_auth.threshold = parseInt(this.newThreshold)
		  }
		  
		  if(JSON.stringify(this.newPermission) == JSON.stringify(this.oldPermission)){
			  modal.alert({
			    message:  this.modalLan.nochange,
			    okTitle: this.modalLan.confirm
			  }, function () {
			  })
			  this.isShow = false
			  return
		  }
		  
		  if(this.edit == "threshold"){
			   this.istransferShow = true
			   return
		  }
		  this.isConfirmDetailShow = true
	  },
	  confirmEditDetail(){
		  this.password = ""
		  this.isConfirmDetailShow = false
		  //this.istransferShow = true
		  this.openSign()
	  },
	  setOpenKey(account){
		this.changePubKey = account.PublicKey
		this.isOpenKeyShow = false
	  },
	  setAccChar(item){
		  this.changeAccChar = item
		  this.newPermission.required_auth.accounts[this.accIndex].permission.permission = this.changeAccChar
		  this.isChangeAccCharShow = false
	  },
	  deletePer(){
		  if(this.edit == "pubKey"){
			  this.newPermission.required_auth.keys.splice(this.accIndex,1)
		  }
		  if(this.edit == "account"){
			  this.newPermission.required_auth.accounts.splice(this.accIndex,1)
		  }
		  console.log(this.newPermission)
		  this.password = ""
		  //new
		  this.chosedPer = this.type
		  this.openSign()
		 // this.istransferShow = true
	  },
	  async ensureEdit(){
		  let validPwd = await checkPassword(this.chosedPubKey,this.currentChain,this.password)
		  if(!validPwd){
			  console.log("this.zhLan.password_notmatch")
		      modal.alert({
		        message: this.modalLan.password_notmatch,
		        okTitle: this.modalLan.confirm
		      }, function () {
		        console.log('alert callback')
		      })
		      return
		  }
		 
		  //要账户名称，权限名称，公钥，密码
		  this.editPer(this.account.account_name,this.chosedPer,this.chosedPubKey,this.password)
	  },
	  async editPer(accountName,choosePer,choosePubKey,password){
		  this.isShow = true
		 
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
		  
		  console.log(form)
		  let result = await updateAuth(form)
		  if(result){
			  modal.toast({
			  	'message': this.modalLan.alter_success,
			  	'duration': 1
			  });
			  setTimeout(()=>{   //设置延迟执行
			    //   this.$router.go(-1)
				this.goBack()
			  },1000);
		  return
		  }else{
			  
		  }
		  this.isShow = false
	  }
  }
};
</script>