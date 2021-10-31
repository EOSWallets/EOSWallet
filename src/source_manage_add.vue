<template>
    <div class="main">
        <div  class="borders"></div>
        <div class="borders">
            <div class="auth-box">
                <text style="line-height:100px;font-size: 32px;">{{zhLan.account_balance}}</text>
                    <text style="font-size: 32px;">{{account.core_liquid_balance}}</text>
            </div>
        </div>

        <div class="account-name borders" >
            <div class="open-key-box">
                <text class="account-name-title">CPU {{zhLan.add_count}}</text>
            </div>
            
            <input ref="numInput" type="number" v-model="cpuPrice" :placeholder="`${zhLan.pls_enter}${currentChain}${zhLan.quantity}`"  class="password">
            <!-- <div>
            <text class="tips">0.000073 YAS = 1ms(天)</text>
            </div> -->
        </div>

        <div class="account-name borders" >
            <div class="open-key-box">
                <text class="account-name-title">NET {{zhLan.add_count}}</text>
            </div>
            
            <input ref="numInput1" type="number" v-model="netPrice" :placeholder="`${zhLan.pls_enter}${currentChain}${zhLan.quantity}`"  class="password">
            <!-- <text class="tips">0.000073 YAS = 1KB(天)</text> -->
        </div>

        <div class="account-name  borders" v-if="toOther">
            <div class="open-key-box">
                <text class="account-name-title">{{zhLan.receive_account}}</text>
            </div>
            <div class="item">
                <input ref="numInput2" type="text" v-model="receiver" :placeholder="`${zhLan.receiver_account}`"  class="input2">
                <div class="choice-box">
                    <text :class="['choice-item', 'choice-item-left',receiveType == 1 ?'choice-selected':'choice-unselected']" @click="borrow">{{zhLan.hire}}</text>
                    <text :class="['choice-item', 'choice-item-right', receiveType == 2 ?'choice-selected':'choice-unselected']"  @click="send">{{zhLan.transfer}}</text>
                </div> 
            </div>
        </div>

        <div class="btn-box">
			<wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="submit" ></wxc-button>
		</div>

        <wxc-popup
            :show="isConfirmShow"
            @wxcPopupOverlayClicked="closeConfirmPop"
            pos="bottom"
            height="600"
            >
            <div>
                <div class="pop-header">
                    <text class="text">{{zhLan.add_mortgage}}</text>
                    <image :src="`${imgSrc}close`"  mode="" 
                        style="height: 45px;width: 45px; right:20px;position:absolute"
                        @click="closeConfirmPop"></image>
                </div>
                <div class="pop-middle">
                    <div class="pop-middle-item">
                        <div style="align-items:center"> 
                            <image :src="`${imgSrc}cpu_green`" mode="" style="height: 40px;width: 40px;"></image>
                            <text style="padding:10px 0 0 0; color:#1E90FF;font-size:32px">CPU</text>
                        </div>
						<!-- 现在根据当前公链来决定代币种类 -->
                        <text style="color:#1E90FF; margin-left:20px;font-size:32px">{{cpuPrice}} {{currentChain}}</text>
                    </div>

                    <div class="pop-middle-item" >
                        <div style="align-items:center"> 
                            <image :src="`${imgSrc}net_green`" mode="" style="height: 40px;width: 40px;"></image>
                            <text style="padding:10px 0 0 0; color:#1E90FF;font-size:32px">NET</text>
                        </div>
                        <text style="color:#1E90FF; margin-left:20px;font-size:32px ">{{netPrice}} {{currentChain}}</text>
                    </div>
                    

                </div>
                <div style="align-items:center">
                    <div class="btn-box">
                        <wxc-button  :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirm" ></wxc-button>
                    </div>
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
                
                <div class="pop-middle1">
                    <div style="flex-direction:row; justify-content:center; align-items:center; padding:20px 0 40px 0; height:90px">
                        <text style="font-size: 32px;">{{currentAccountName}} @{{currentpermission}}</text>
                    </div>
                    <div style="flex-direction:row; margin-bottom:20px">
                        <text style="font-size: 32px;line-height:42px">{{zhLan.enter}}</text>
                        <text style="background-color:#1E90FF;padding:5px;font-size: 32px;color:#ffffff">{{publicKeyFormatter(currentPubkey)}}</text>
                        <text style="font-size: 32px;line-height:42px">{{zhLan.ofprikey_password}}</text>
                    </div>

                    <div >
                        <input ref="numInput3" type="password" v-model="password" :placeholder="`${zhLan.this_password}`" class="password" @keyboard="popKeyBoard">
                    </div>

                    <div>
                        <text class="tips1" style="padding-top:10px">{{zhLan.forget_password_show}}</text>
                    </div>
                    <div style="align-items:center">
                        <div class="btn-box">
                            <wxc-button :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensure" ></wxc-button>
                        </div>
                    </div>
                </div>
            </div> -->
			<div style="width:750px"><sign-util/></div>
        </wxc-popup>
        <wxc-loading :show="isShow" type="default" :need-mask="true" ></wxc-loading>
    </div>
</template>


<script>
	import {
		WxcMinibar, WxcPopup, WxcButton, WxcLoading
    } from 'weex-ui';
    import { AESKey, cpuPrice } from './utils/config'
    //import { delegate } from './utils/eos'
    import {
        encryptKey
    } from './utils/auth'
    // import { checkPassword} from "./utils/auth"
    import { imgSrc,getStorage } from "./utils/config";
    // import { getCurrentAccountInfo } from './utils/account'
	
	//new
	import { getCurrentAccountInfo } from './utils/account_v2'
	import { checkPassword} from "./utils/auth_v2"
	import { delegate } from './utils/eos_v2'
	import SignUtil from "./sign_util"
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
     const globalLan = require('./utils/language/global')
	 const navigator = weex.requireModule('navigator')
export default {
    components: {
		WxcMinibar, WxcPopup, WxcButton, WxcLoading,SignUtil
	},
  data() {
      return {
          imgSrc: imgSrc,
          isConfirmShow: false,
          isEnsureShow: false,
          typeName: "公钥",
          openKey: "",
          receiveType: 1,
          borderColor: "",
          borderRadius: "",
          backgroundColor:"#1E90FF",
          fontSize: '35px',
          color: "#ffffff", 
          cpuPrice: "",
          netPrice: "",
          account: {},
          receiver: '',
          password: '',
          currentPubkey: '',
          type: 'cpu',
          toOther: false,
          currentAccountName: '',
          currentpermission: 'active',
          isShow: false,
          popH: 600,
          currentChain:"",
          globalLan: globalLan,
          zhLan: {},
          modalLan:{}
      }
  },
  async mounted() {
		 	console.log("add获取语言开始")
			let lan = await getStorage('lan')
			console.log("语言类型",lan)
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
            this.zhLan = await this.globalLan.lang("source_manage_add", lan)
            this.modalLan = await this.globalLan.lang("modal", lan)
			console.log("add语言包",JSON.stringify(this.zhLan))
		},
  async created() {
    //   if(this.$route.query.type) {
    //       this.type = this.$route.query.type
    //   }
    //   if(this.$route.query.toOther) {
    //       this.toOther = this.$route.query.toOther
    //   }
      storage.getItem("source", res =>{
	  	console.log("获取缓存:",JSON.stringify(res))
	  	let authoritySt = JSON.parse(res.data)
          this.type = authoritySt.type
          this.toOther = authoritySt.toOther
      })
      
	  let chainManager = JSON.parse(await getStorage("ChainManager"))
	  this.currentChain = chainManager.CurrentChain
	  
    let account = JSON.parse(await getStorage("Account"))
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

    if(!this.toOther) {
        this.receiver = account.account_name
    }
    console.log(this.account)
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
      borrow() {
          this.receiveType = 1
      },
      send() {
          this.receiveType = 2
      },
      async submit() {
		  if(this.$refs["numInput"]){
		  	this.$refs["numInput"].blur()
		  }
		  if(this.$refs["numInput1"]){
		  	this.$refs["numInput1"].blur()
		  }
		  if(this.$refs["numInput2"]){
		  	this.$refs["numInput2"].blur()
		  }
		  if(this.$refs["numInput3"]){
		  	this.$refs["numInput3"].blur()
		  }
        // let title = this.type.toUpperCase()
        // console.log("五五："+this.cpuPrice)
        if(!this.cpuPrice || this.cpuPrice == 0) {
            modal.toast({
                message: this.modalLan.please_enter+ 'CPU' + this.modalLan.add_mortgage_count,
                duration: 2
            })
            return 
        }
        this.cpuPrice = this.getFloat(this.cpuPrice,4)
        this.netPrice = this.getFloat(this.netPrice,4)

        if(parseFloat(this.cpuPrice) < parseFloat(0.0001)) {
            modal.toast({
                message: 'CPU' + this.modalLan.mortgage_less,
                duration: 2
            })
            return 
        }
        if (!this.netPrice || this.netPrice === 0) {
            modal.toast({
                message: this.modalLan.please_enter+ 'NET' + this.modalLan.add_mortgage_count,
                duration: 2
            })
            return 
        }
        if(parseFloat(this.netPrice) < parseFloat(0.0001)) {
            modal.toast({
                message: 'NET' + this.modalLan.mortgage_less,
                duration: 2
            })
            return 
        }

        if(this.toOther && !this.receiver) {
            modal.toast({
                message: this.modalLan.enter_receiver,
                duration: 2
            })
            return 
        }

        let account = await getCurrentAccountInfo(this.receiver, this.currentChain)
        console.log("获取到链上账号信息：", JSON.stringify(account))
        if(JSON.stringify(account) == "{}") {
            modal.toast({
                message: this.modalLan.check_receiver,
                duration: 2
            })
            return	
        }
          this.isConfirmShow = true
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
      async ensure() {
		 
          this.isShow = true
          this.isEnsureShow = false
        let validPwd = await checkPassword(this.currentPubkey,this.currentChain,this.password)
        if(!validPwd){
            this.isShow = false
            modal.toast({
                message: this.modalLan.password_notmatch,
                duration: 2
            })
            this.password = ""
            return
        }
        let isTransfer = false
        if(this.receiveType == 1) {
            isTransfer = false
        }else {
            isTransfer = true
        }
        let cpuPrice = this.cpuPrice ? this.cpuPrice : 0.0000
        let netPrice = this.netPrice ? this.netPrice : 0.0000
        let form = {
            password: this.password,
            publicKey: this.currentPubkey,
            symbols: this.currentChain,
            account: this.currentAccountName,
            permission: this.currentpermission,
            receiver: this.receiver,
            netPrice: this.getFloat(netPrice, 4),
            cpuPrice: this.getFloat(cpuPrice, 4),
            isTransfer: isTransfer
        }

        console.log(form)

        let result = await delegate(form)
        if(JSON.stringify(result) == "{}") {
            this.isShow = false
            modal.toast({
                message: this.modalLan.mortage_fail,
                duration: 2
            })
            return
        }

        this.isShow = false
        modal.toast({
            message: this.modalLan.mortage_success,
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
        }
  }
};
</script>

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
        padding: 20px 40px;
        background-color: #fff;
        /* margin-bottom: 10px; */
    }
    .account-name-title {
        font-size: 32px;
        
        /* font-weight: bold; */
    }
    .open-key-box {
        flex-direction: row;
        align-items: center;
        padding-bottom: 20px;
        justify-content: space-between;
    }
    .choice-box {
        background-color: #ffffff;
        border-width:1px;
		border-color:#1E90FF;  
		border-style:solid; 
        border-radius: 10px;
 
        font-size: 32px;
        color: #1E90FF;
        /* width: 120px; */
        align-items: center;
        text-align: center;
        justify-content: space-between;
        line-height: 50px;
        height: 50px;
        flex-direction: row;
    }
    .choice-item {
        padding: 10px 30px;
        color: #ffffff;
        font-size: 28px;
    }

    .choice-selected {
        background-color: #1E90FF;
        color: #ffffff;
    }

    .choice-unselected {
        background-color: #1E90FF;
        color: #1E90FF;
    }

    .choice-item-left {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .choice-item-right {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
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
        width: 400px;
        margin-right: 20px;
        height: 80px;
         
    }

    .tips {
        right: 0px;
        text-align: end;
        font-size: 28px;
        color: gray;
        padding-top: 20px;
    }

    .tips1 {
        font-size: 28px;
        color: gray;
        padding-top: 20px;
    }

.auth-box-account {
    align-items: center;
}
.auth-box-item-left {
    flex-direction: row;
    line-height: 100px;
}

.btn-box {
    margin: 50px 0 100px 0;
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
</style>