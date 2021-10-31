<template>
    <div class="main">
        <div  class="borders"></div>
        <div class="borders">
            <div class="auth-box">
                <text style="line-height:100px;font-size:32px;" >{{zhLan.needto_redeem_account}}</text>
                <div class="auth-box-type-right" @click="openPop">
                    <text style="font-size:32px;">{{receiver.to}}</text>
                    <image :src="`${imgSrc}right`" mode="" style="height: 32px;width: 32px; margin-left: 10px;"></image>
                </div>
            </div>
        </div>

        <div class="account-name borders">
            <div class="open-key-box">
                <text class="account-name-title">CPU {{zhLan.redeem_account}}</text>
            </div>
            
            <input ref="numInput" type="text" v-model="cpuPrice" :placeholder="`${zhLan.pls_enter}${currentChain}${zhLan.quantity}`"  class="password">
            <div class="tips-box">
                <text class="tips">{{zhLan.can_redeem}}{{receiver.cpu_weight}}</text>
                <text class="tips">{{zhLan.left}}{{cpuAvail}} s</text>
            </div>

        </div>

        <div class="account-name borders">
            <div class="open-key-box">
                <text class="account-name-title">NET {{zhLan.redeem_account}}</text>
            </div>
            
            <input ref="numInput" type="text" v-model="netPrice" :placeholder="`${zhLan.pls_enter}${currentChain}${zhLan.quantity}`"  class="password">
            <div class="tips-box">
                <text class="tips">{{zhLan.can_redeem}}{{receiver.net_weight}}</text>
                <text class="tips">{{zhLan.left}}{{netAvail}} MB</text>
            </div>

        </div>

        <div class="btn-box">
			<wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="submit" ></wxc-button>
		</div>

        <wxc-popup 
            :show="isPopShow"
            @wxcPopupOverlayClicked="closePop"
            pos="bottom"
            height="720">
            <div>
                <div class="pop-header">
                    <text class="text">{{zhLan.account_list}}</text>
                    <image :src="`${imgSrc}close`"  mode="" 
                        style="height: 45px;width: 45px; right:20px;position:absolute"
                        @click="closePop"></image>
                </div>
                <div class="pop-middle">
                    <scroller style="height:600px">
                        <div class="pop-middle-item" @click="changeReceiver(item)" v-for="(item, index) in receivers" :key="index">
                            <div>
                                <text class="pop-middle-item-text">{{item.to}}</text>
                                <text class="pop-middle-item-text-tips">CPU: {{item.cpu_weight}}, NET：{{item.net_weight}}</text>
                            </div>
                            <image :src="`${imgSrc}right_gray`" mode="" style="height: 28px;width: 28px;"></image>
                        </div>
                    </scroller>

                </div>
            </div>
        </wxc-popup>


        <wxc-popup
            :show="isConfirmShow"
            @wxcPopupOverlayClicked="closeConfirmPop"
            pos="bottom"
            height="600"
            >
            <div>
                <div class="pop-header">
                    <text class="text">{{zhLan.redeem_mortgage}}</text>
                    <image :src="`${imgSrc}close`"  mode="" 
                        style="height: 45px;width: 45px; right:20px;position:absolute"
                        @click="closeConfirmPop"></image>
                </div>
                <div class="pop-middle1">
                    <div class="pop-middle-item1">
                        <div  style="align-items:center"> 
                            <image :src="`${imgSrc}cpu_green`" mode="" style="height: 40px;width: 40px;"></image>
                            <text style="padding:10px 0 0 0; color:#1E90FF;font-size:32px">CPU</text>
                        </div>
                        <text style="color:#1E90FF; margin-left:20px;font-size:32px">{{cpuPrice}} {{currentChain}}</text>
                    </div>

                    <div class="pop-middle-item1" >
                        <div  style="align-items:center"> 
                            <image :src="`${imgSrc}net_green`" mode="" style="height: 40px;width: 40px;"></image>
                            <text style="padding:10px 0 0 0; color:#1E90FF;font-size:32px">NET</text>
                        </div>
                        <text style="color:#1E90FF; margin-left:20px;font-size:32px">{{netPrice}} {{currentChain}}</text>
                    </div>
                    

                </div>
                <div class="btn-box">
                    <wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirm" ></wxc-button>
                </div>
            </div>
        </wxc-popup>


        <!-- 抵押密码确认 -->
        <wxc-popup 
            :show="isEnsureShow"
            @wxcPopupOverlayClicked="closeEnsurePop"
            pos="bottom"
            popup-color="rgb(255,255,255)"
            style="background-color:#fff"
            :height="popH">
            <!-- <div>
                <div class="pop-header">
                    <text class="text">{{zhLan.trans_sign}}</text>
                    <image :src="`${imgSrc}close`"  mode="" 
                        style="height: 45px;width: 45px; right:20px;position:absolute"
                        @click="closeEnsurePop"></image>
                </div>
                
                <div class="pop-middle">
                    <div style="flex-direction:row; justify-content:center; align-items:center; padding:20px 0 40px 0; height:90px">
                        <text style="font-size:28px">{{currentAccountName}} @{{currentpermission}}</text>
                    </div>
                    <div style="flex-direction:row; margin-bottom:20px">
                        <text style="font-size:32px">{{zhLan.enter}}</text>
                        <text style="background-color:#1E90FF;padding:5px;font-size:32px;color:#ffffff">{{publicKeyFormatter(currentPubkey)}}</text>
                        <text style="font-size:32px">{{zhLan.ofprikey_password}}</text>
                    </div>

                    <div >
                        <input ref="numInput" type="password" v-model="password" :placeholder="`${zhLan.this_password}`" class="password" @keyboard="popKeyBoard">
                    </div>

                    <div>
                        <text class="tips1" style="padding-top:10px">{{zhLan.forget_password_show}}</text>
                    </div>
                        <div class="btn-box">
                            <wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensure" ></wxc-button>
                        </div>
                </div>
            </div> -->
			<div style="width:750px"><sign-util/></div>
        </wxc-popup>
        <wxc-loading :show="isShow" type="default" :need-mask="true" ></wxc-loading>
    </div>
</template>

<style scoped>
.main {
    background-color:#f2f3f5;
    height: 1500px;
}
.navigator {
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    background-color: #ffffff;
}
.borders {
    border-bottom-width: 20px;
    /* border-top-width: 20px; */
    border-color: #f2f3f5;
    border-style: solid;
}

.auth-box {
    /* height: 100px;
    margin-bottom: 20px; */
    background-color: #fff;
    padding: 0 40px;
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
        /* margin-bottom: 10px; */
    }
    .account-name-title {
        font-size: 32px;
        margin-bottom: 20px;
        
    }
    .open-key-box {
        flex-direction: row;
        align-items: center;
        padding-bottom: 40px;
        justify-content: space-between;
    }
    .choice-box {
        background-color: #ffffff;
        border: 1px solid #1E90FF ;
        border-radius: 10px;
 
        font-size: 28px;
        color: #1E90FF;
        /* width: 120px; */
        align-items: center;
        text-align: center;
        justify-content: space-between;
        line-height: 50px;
        /* height: 50px; */
        flex-direction: row;
    }
    .choice-item {
        padding: 10px 30px;
        color: #ffffff;
        
        font-size: 24px;

    }

    .choice-selected {
        background-color: #1E90FF;
    }

    .choice-item-left {
                border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .choice-item-right {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
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
       		font-size: 28px;
        padding: 0 0 10px 20px;
        outline: none;
               border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        width: 60%;
        margin-right: 20px;
         
    }

    .tips-box {
        flex-direction: row;
        justify-content: space-between;
        padding: 20px;
    }

    .tips {
        /* right: 0px; */
        text-align: end;
        font-size: 24px;
        color: gray;
        
    }

.auth-box-account {
    align-items: center;
}
.auth-box-item-left {
    flex-direction: row;
    line-height: 100px;
}

.btn-box {
    align-items: center;
    padding-top: 50px;
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

    font-size: 32px;
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
    font-size: 28px;
    letter-spacing: 2px;
}
.pop-middle {
    /* height: 300px; */
    padding: 0 20px;
}
.pop-middle1 {
    padding: 20px 20px;
    align-items: center;
    justify-content: center;

}
.pop-middle-item {
    height: 120px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    padding: 10px;
}

.pop-middle-item1{
    height: 120px;
    width: 400px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    background-color: #e6fef1;
    margin: 10px 0;

}
.pop-middle-item-text {
    font-size: 28px;
}
.pop-middle-item-text-tips {
    font-size: 24px;
    color: gray;
}
.pop-footer {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.pop-footer-text {
    font-size: 28px;
    color: rgb(212, 5, 5);
    font-weight: bold;
}
.auth-box-top-text {
    font-size: 28px;
    color: gray;
}
</style>
<script>
	import {
		WxcMinibar, WxcPopup, WxcButton, WxcIcon, WxcLoading
    } from 'weex-ui';
    // import { checkPassword} from "./utils/auth"
    // import { getResourceBalance, undelegate } from './utils/eos'
    import { imgSrc, getStorage } from "./utils/config"
	//import { getCurrentAccountInfo } from './utils/account'
	
	//new
	import { getCurrentAccountInfo } from './utils/account_v2'
	import { checkPassword} from "./utils/auth_v2"
	import { getResourceBalance, undelegate } from './utils/eos_v2'
	import SignUtil from "./sign_util"
    const modal = weex.requireModule('modal')
    const globalLan = require('./utils/language/global')
    const storage = weex.requireModule('storage');
	const navigator = weex.requireModule('navigator')
        
export default {
    components: {
		WxcMinibar, WxcPopup, WxcButton, WxcIcon, WxcLoading,SignUtil
	},
  data() {
      return {
          imgSrc: imgSrc,
          isPopShow: false,
          typeName: "公钥",
          openKey: "",
          receiveType: 1,
          account: {},
          receivers:[],
          receiver: {},
          cpuAvail: 0,
          netAvail: 0,
          cpuPrice: "",
          netPrice: '',
            isConfirmShow: false,
            isEnsureShow: false,
            borderColor: "",
            borderRadius: "",

            backgroundColor:"#1E90FF",
            fontSize: '35px',
            color: "#ffffff", 
            redeemAccount: '',
            currentPubkey: '',
            currentpermission: '',
            currentAccountName: '',
            password: '', 
            isShow: false,
            popH: 600,
            currentChain:"",
            globalLan: globalLan,
            zhLan: {},
		  modalLan:{}

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
			this.zhLan = await this.globalLan.lang("source_manage_redeem", lan)
			this.modalLan = await this.globalLan.lang("modal", lan)
			console.log("语言包",JSON.stringify(this.zhLan))
		},
  async created() {
    let account = JSON.parse(await getStorage("Account"))
	let chainManager = JSON.parse(await getStorage("ChainManager"))
	  this.currentChain = chainManager.CurrentChain
            this.account = await getCurrentAccountInfo(account.account_name,this.currentChain)
        this.currentAccountName = this.account.account_name
    if( this.account.permissions.length > 1) {
        this.currentpermission = 'active'
        for (let index = 0; index < this.account.permissions.length; index++) {
            if(this.account.permissions[index].perm_name == 'active') {
                this.currentPubkey = this.account.permissions[index].required_auth.keys[0].key
                break
            }   
        }
    } else {
        this.currentpermission = this.account.permissions[0].perm_name
        this.currentPubkey = this.account.permissions[0].required_auth.keys[0].key
    }
    
    let info = await getResourceBalance(this.account.account_name)
    console.log("info："+JSON.stringify(info))
    this.cpuAvail = Math.round(info.accountInfo.cpu_limit.available/10000)/100
    this.netAvail = Math.round(info.accountInfo.net_limit.available*100/1024/1024)/100
    this.receivers = info.receiveAccounts.rows
    if(this.receivers.length > 0) {
        this.receiver = this.receivers[0]
    }
     console.log(info)
	 this.getSign()
	 this.getKeyBoard()
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
  methods: {
    popKeyBoard(e) {
        console.log("弹出输入框")
        console.log(e)
        if(e.isShow) {
            this.popH = 600 + e.keyboardSize + 100
        }else {
            this.popH = 600
        }
    },
      goBack() {
          navigator.pop({
              animated: "true"
          }, event => {
              console.log('callback: ', event)
          })
      },
    publicKeyFormatter(publicKey) {
          return publicKey? publicKey.substring(0,3) + "..." + publicKey.substring(publicKey.length-4,publicKey.length): ""
      },
      addPriKey() {
          console.log("ss")
          this.$router.push('/private_key_create')
      },
      openPop() {
          console.log("ssssssssssssss")
          this.isPopShow = true
      },
      closePop () {
        this.isPopShow = false;
      },
    closeConfirmPop() {
          this.isConfirmShow = false
      },
      confirm() {
          this.isConfirmShow = false
          this.popH = 600
          //this.isEnsureShow = true
		  this.openSign()
      },
      closeEnsurePop() {
          this.password = ""
          this.isEnsureShow = false
      },
      changeReceiver(e) {
          this.receiver = e
          this.isPopShow = false
      },

      borrow() {
          this.receiveType = 1
      },
      send() {
          this.receiveType = 2
      },
      submit() {
		 if(this.$refs["numInput"]){
		 	this.$refs["numInput"].blur()
		 }
		 if(this.$refs["numInput1"]){
		 	this.$refs["numInput1"].blur()
		 }
		 if(this.$refs["numInput2"]){
		 	this.$refs["numInput2"].blur()
		 }
		 
        if(!this.cpuPrice || this.cpuPrice == 0) {
            modal.toast({
                message: this.modalLan.enter+ 'CPU' + this.modalLan.redeem_count,
                duration: 2
            })
            return 
        }
        let cpuAvail = parseFloat(this.receiver.cpu_weight.substring(0, this.receiver.cpu_weight.indexOf(" ")))
        if(parseFloat(this.cpuPrice) > cpuAvail) {
            modal.toast({
                message: 'CPU' + this.modalLan.redeem_count_notenough,
                duration: 2
            })
            return 
        }
        if(parseFloat(this.cpuPrice) < parseFloat(0.0001)) {
            modal.toast({
                message: 'CPU' + this.modalLan.redeem_less,
                duration: 2
            })
            return 
        }
        if (!this.netPrice || this.netPrice === 0) {
            modal.toast({
                message: this.modalLan.enter+ 'NET' + this.modalLan.redeem_count,
                duration: 2
            })
            return 
        }
        this.cpuPrice = this.getFloat(this.cpuPrice,4)
        this.netPrice = this.getFloat(this.netPrice,4)
        if(parseFloat(this.netPrice) < parseFloat(0.0001)) {
            modal.toast({
                message: 'NET' + this.modalLan.redeem_less,
                duration: 2
            })
            return 
        }

        let netAvail = parseFloat(this.receiver.cpu_weight.substring(0, this.receiver.cpu_weight.indexOf(" ")))
        if(parseFloat(this.netPrice) > netAvail) {
            modal.toast({
                message: 'NET' + this.modalLan.redeem_count_notenough,
                duration: 2
            })
            return 
        }

        this.isConfirmShow = true
      },
	  openSign(){
	  		  let signData ={accountName:this.account.account_name,chainName:this.currentChain}
	  		  storage.setItem("to_sign", signData)
	  		  this.isEnsureShow = true //页面放入弹出框的状态
	  	  },
	  getSign(){
	  		  let that = this
	  		  let getSign = new BroadcastChannel('sign_to')
	  		  getSign.onmessage = function (event) {
	  		    console.log("接收到监听",event.data) // Assemble!
	  			let signData = event.data
	  		    console.log("接收到签名返回",signData.pubkey)
	  			that.isEnsureShow = false
	  			that.currentpermission = signData.permission
	  			that.currentPubkey = signData.pubkey
	  			that.password = signData.password
	  			that.ensure()
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
      async ensure() {
		console.log("进入赎回")
        this.isShow = true
        this.isEnsureShow = false
        let validPwd = await checkPassword(this.currentPubkey,this.currentChain,this.password)
		console.log("进入赎回,密码校验")
        if(!validPwd){
            this.isShow = false
            modal.toast({
                message: this.modalLan.password_notmatch,
                duration: 2
            })
            this.password = ""
            return
        }

        let cpuPrice = this.cpuPrice ? this.cpuPrice : 0.0000
        let netPrice = this.netPrice ? this.netPrice : 0.0000
        let form = {
            password: this.password,
            publicKey: this.currentPubkey,
            symbols: this.currentChain,
            account: this.currentAccountName,
            permission: this.currentpermission,
            receiver: this.receiver.to,
            netPrice: netPrice,
            cpuPrice: cpuPrice
        }

        console.log(form)

        let result = await undelegate(form)
        if(JSON.stringify(result) == "{}") {
            this.isShow = false
            modal.toast({
                message: this.modalLan.redeem_fail,
                duration: 2
            })
            return
        }

        this.isShow = false
        modal.toast({
            message: this.modalLan.redeem_success,
            duration: 2
        })

        this.password = ""
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
      },
                  getFloat(number, n) {
	n = n ? parseInt(n) : 0;
	if(n <= 0) {
		return Math.round(number);
	}
	number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
	number = Number(number).toFixed(n); //补足位数
	return number;
}, 
  }
};
</script>