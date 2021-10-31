<template>
    <div class="main" ref="test" @appear="appear">
        <div class="navigator">
	    	<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;"  @click="goBack"></image>
	    	<text style="font-size: 36px; color: #1E90FF" >{{zhLan.title}}</text>
	    	<image src="" style="height: 60px;width: 60px"></image>
        </div>

        <div class="account_header">
            <div class="account_header_img">
                <image :src="`${imgSrc}${chain_img}`" style="margin-top:12px;height: 100px;width:100px;"  @click="goBack"></image>
            </div>
            <div class="account_header_info">
                <text class="account_name">{{account.account_name}}</text>
                <text class="account_pubkey">{{dealPubKey(account.publickey)}}</text>
            </div>
        </div>

        <div class="choice-box" @click="goBackup">
            <div class="choice-box-item-left">
                <text style="line-height:65px;font-size:32px">{{zhLan.export_private_key}}</text>
            </div>
            <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
        </div>
        <div class="choice-box" @click="jumpAuthority">
            <div class="choice-box-item-left">
                <text style="line-height:65px;font-size:32px">{{zhLan.authority_management}}</text>
            </div>
            <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
        </div>
        <div class="short-line"></div>
        <div class="choice-box" @click="goModifyPwd" style="margin-top:0;">
            <div class="choice-box-item-left">
                <text style="line-height:65px;font-size:32px">{{zhLan.change_password}}</text>
            </div>
            <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
        </div>
        <div class="choice-box" @click="delAccount">
            <div class="choice-box-item-left">
                <text style="line-height:65px;font-size:32px;color:red;">{{zhLan.delete_account}}</text>
            </div>
            <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
        </div>

    <!-- 账号删除提示 -->
    <wxc-dialog :title="zhLan.del_account"
                :content="zhLan.warn1"
                :show="showWarn"
                :single="false"
                :is-checked="isChecked"
                :cancel-text="zhLan.cancel"
                :confirm-text="zhLan.already_backup"
                main-btn-color="#FF0000"
                @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                @wxcDialogConfirmBtnClicked="showDeletePop"
                @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
    </wxc-dialog>

    <!-- 确认删除 -->
	  <wxc-popup
        :show="showEnsure"
        @wxcPopupOverlayClicked="closeConfirmPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        :height="popH">
        <div>
            <div class="pop-header">
                <text class="text" style="font-size:32px;font-weight:bold;">{{zhLan.delete_account}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeConfirmPop"></image>
            </div>             
            
            <div class="pop-middle">
                <div class="middle-top">
                    <div style="justify-content:center; align-items:center;">
                        <text style="font-size:32px;">{{account.account_name}}</text>
                    </div>
                </div>

				<div style="flex-direction:row; margin-bottom:20px">
					<text style="font-size:32px;">{{zhLan.input}}</text>
					<text style="background-color:#1E90FF;padding:5px;font-size:32px;;color:#ffffff">{{dealPubKey(account.publickey)}}</text>
					<text style="font-size:32px;">{{zhLan.private_password}}</text>
				</div>

				<div class="password-item">
					<input type="password" v-model="password" :placeholder="zhLan.private_password2" class="password" @keyboard="popKeyBoard">
				</div>
				<div class="btn-box">
					<wxc-button size="big" :text="transBtn"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureDelete" :disabled="transDisabled"></wxc-button>
				</div>
            </div>
        </div>
    </wxc-popup>

    </div>
</template>

<style scoped>
.main {
  opacity: 1;
    background-color: #F6F6F6;
}

	.btn-box {
		margin-top: 50px;
        align-items: center;
	}
    .text{

        font-size: 36px;
        font-weight:bold;
    }
	.password {
		font-size: 32px;
        height: 60px;
		border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        padding: 0 0 10px 20px;
        outline: none;
	}
.pop-middle {
    /* height: 300px; */
    padding: 0 20px;
}
.middle-top {
	margin:40px 0;
}
.pop-middle-item {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
}
.pop-middle-item-text {
    font-size: 32px;
    text-align: center;
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

.navigator {
    /* border-bottom-width: 1px;
	border-bottom-color: #C0C0C0;
	border-bottom-style: solid; */
	width: 750px;
    height: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #ffffff;
}

.account_header{
    background-color: #ffffff;
    height: 125px;
    margin-top: 20px;

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
	align-items: stretch;
}
.account_header_img{
    margin-left: 30px;
	align-content: center;
	width: 125px;
	display: inline-block; 
	vertical-align: middle;
}
.account_header_info{
	align-content: center;
	width: 595px;
	display: inline-block; 
	vertical-align: middle;
}
.account_name{
    height: 65px;
    line-height: 65px;
    margin-left: 10px;
    margin-top: 8px;
    font-size: 32px;
    font-weight: bold;
}
.account_pubkey{
    height: 60px;
    line-height: 60px;
    margin-left: 10px;
    margin-top: -18px;
    font-size: 30px;
    color: #AFB1B5;
}

.choice-box {
    width: 750px;
    height: 90px;
    margin-top: 20px;    
    padding: 20px;
    line-height: 90px;
    background-color: #ffffff;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.choice-box-item {
    flex-direction: row;
    justify-content: space-between;
}
.choice-box-item-left {
    flex-direction: row;
    line-height: 90px;
    margin-left: 20px;
}
.short-line{    
    height: 1px;
    width:750px;
}
</style>
<script>
  import { WxcMinibar, WxcPopup, WxcDialog, WxcButton } from 'weex-ui';
  import { imgSrc } from "./utils/config_v2";
  import { getStorage } from './utils/config_v2';
    import { checkPassword} from "./utils/auth_v2"
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const navigator = weex.requireModule('navigator')
  const storage = weex.requireModule('storage')
  const globalLan = require('./utils/language/global')
  const utils = require('./appUtils')

export default {
  components: { WxcMinibar, WxcPopup, WxcDialog, WxcButton },
  data() {
    return {
      imgSrc: imgSrc,
      globalLan: globalLan,
      zhLan: {},
      fontSize: '35px',
      color: "#ffffff", 
	  width: "600px",
	  borderColor: "",
	  borderRadius: "",
	  height: "100px",
	  backgroundColor: "#1E90FF",
      currentLan: '',
      account:{},
      transBtn:"",
      password:"",
      chain_img:"",
      popH: 550,
      transDisabled:false,
      isChecked: false,
      showWarn:false,
      showEnsure:false,
      keyboardShow:false,
      transDisabled: false,
    }
  },
  async created() {
  },
  async mounted() {     
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

    
      this.zhLan = await this.globalLan.lang("account_detail", lan)
      this.modalLan = this.globalLan.lang("modal", lan)
      this.buttonLan = this.globalLan.lang("button", lan)
      this.transBtn = zhLan.confirm_delete

      let account = JSON.parse(await getStorage("account_detail"))
      this.account = account;
      this.chain_img = account.chain.toLowerCase();
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
  methods: {  
    popKeyBoard(e) {
        console.log("弹出输入框")
        console.log(e)
        this.keyboardShow = e.isShow
        if(e.isShow) {
            this.popH = 550 + e.keyboardSize + 100
        }else {
            this.popH = 550
        }
    },  
    async goBackup() {
        let data = {publicKey:this.account.publickey, chainName:this.account.chain}
        await storage.setItem("private_key_backup",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('private_key_backup.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    }, 
    
	async jumpAuthority(){
        let data = {accountName: this.account.account_name, chainName:this.account.chain}
        await storage.setItem("authority",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('authority.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    
    // 修改密码
    async goModifyPwd() {
        let data = {publicKey:this.account.publickey, chain:this.account.chain}
        await storage.setItem("alter_password",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('alter_password.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },

    delAccount(){
        this.showWarn = true;
    },
	closeConfirmPop() {
        this.showEnsure = false
	},
    
    async ensureDelete(){
        this.transBtn = "正在处理中，请稍候。。。"
        this.transDisabled = true
        let that = this

        //校验密码
        console.log("checkPassword: ", this.account.publickey, this.account.chain, this.password)
        let validPwd = await checkPassword(this.account.publickey, this.account.chain, this.password)        
        if(!validPwd){
            modal.toast({
                message: that.modalLan.password_notmatch,
                duration: 2
            })
            this.transBtn = this.buttonLan.confirm
            this.transDisabled = false  
            return
        }
        //删除账号
        let newPubkeyObj;
        let pubkeyIndex;
        let accountManager = JSON.parse(await getStorage("AccountManager_v2"))
        //循环公钥 找到目标公钥对象
        accountManager[this.account.chain].forEach((pubkeyObj, pubkeyIndex) => {
            if(pubkeyObj.PublicKey == this.account.publickey){                
                //循环账号，找到目标账号下标
                let flag = false;
                for(var accountIndex = 0; accountIndex < pubkeyObj.Accounts.length; accountIndex++){
                    if(pubkeyObj.Accounts[accountIndex].Account == this.account.account_name){
                        //拿到了目标账号的下标
                        newPubkeyObj = pubkeyObj
                        newPubkeyObj.Accounts.splice(accountIndex, 1);
                    }
                };
            }
        });
        console.log("newPubkeyObj: ", newPubkeyObj)
        //删除账号
        accountManager[this.account.chain][pubkeyIndex] = newPubkeyObj;
        await storage.setItem('AccountManager_v2', JSON.stringify(accountManager))
        this.showAccountPop = false;

        modal.toast({
            message: "账号删除成功",
            duration: 2
        })
        let accountManager2 = JSON.parse(await getStorage("AccountManager_v2"))
        console.log("0821 accountManager: ", JSON.stringify(accountManager2))
		const lanSet = new BroadcastChannel('account_refresh')
        lanSet.postMessage(this.account.chain)
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },

    dealPubKey(key){
        return key.substring(0, 7) + "..." + key.substring(key.length - 6, key.length);
    },
    async appear() {
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
    
      this.zhLan = await this.globalLan.lang("my", lan)
    },
    changeLan() {
      navigator.push({
        url: utils.getUrl('language_set.js'),
        animated: "true"
      }, event => {
        console.log('callback: ', event)
      })
    },
	goBack() {
		const lanSet = new BroadcastChannel('account_refresh')
        lanSet.postMessage(this.account.chain)
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })	
    },
    
    wxcDialogCancelBtnClicked () {
      this.showWarn = false;
    },
    showDeletePop () {
      this.showWarn = false;
      this.showEnsure = true;
    },
    wxcDialogNoPromptClicked (e) {
      this.isChecked = e.isChecked;
    }
  }
};
</script>