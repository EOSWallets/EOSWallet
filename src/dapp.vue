<template>
  <div class="main">
    	<div class="navigator">
        <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
        <text style="font-size: 32px; color: #1E90FF" >{{dappName}}</text>
        <image src="" style="height: 40px;width: 40px"></image>
      </div>
      <!-- 等待动画 -->
    <!-- <div class="load_img">
        <image class="box" ref="test" v-if="isLoadingImgShow" @click="move" :src="`${imgSrc}logo`"></image>
    </div> -->
    <!-- WebView -->
    <div class="webview-div" :style="webViewStyle">
      <wxc-progress :value="value" :bar-width=750 v-if="progressVisible"></wxc-progress>
      <injectionWebView :dappUrl="dappUrl" ref="injectWebView" :style="scrollerStyle" class="webview"></injectionWebView>
    </div>
    
    <!-- 交易信息确认dialog -->
	  <wxc-popup
        :show="isConfirmShow"
        @wxcPopupOverlayClicked="closeConfirmPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="775">
        <div>
            <div class="pop-header">
                <text class="text" style="font-size:32px;font-weight:bold;">{{zhLan.confirm_traninfo}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeConfirmPop"></image>
            </div>
            
            <scroller class="scroller" show-scrollbar='false'>              
              <div class="pop-middle" v-for="(item, i) in TxMsg" :key="i">
                <div class="pop-middle-item4">
						      <text class="pop-middle-item3-left">{{zhLan.contract_act}}</text>
						      <text class="pop-middle-item3-right">{{item.code}} - {{item.action}}</text>
                </div>
					      <div class="pop-middle-item3">
						      <text class="pop-middle-item3-left">{{zhLan.params}}</text>
						      <pre class="pop-middle-item3-right" style="margin-left:30px;">{{item.args}}</pre>
                </div>
              </div>
            </scroller>
         <div style="height:200px; align-items:center; margin-bottom:10px;">
						<wxc-button size="big" :text="zhLan.confirm"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin-top:10px;  text-align:center" @wxcButtonClicked="confirmInfo"></wxc-button>
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
          <text class="text" style="font-size:32px;font-weight:bold;">{{zhLan1.trans_sign}}</text>
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
					<text style="font-size:28px">{{zhLan1.enter}}</text>
					<text style="background-color:#1E90FF;padding:5px;font-size:28px;color:#ffffff">{{publicKeyFormatter3(creatorPubkey)}}</text>
					<text style="font-size:28px">{{zhLan1.ofprikey_password}}</text>
				</div>

				<div class="password-item">
					<!-- <input type="password" style="padding-bottom:5px" v-model="password" :placeholder="zhLan.this_password" class="password" @keyboard="popKeyBoard"/> -->
					<input type="password" style="padding-bottom:5px" v-model="password" :placeholder="zhLan.this_password" class="password"/>
				</div>

				<div>
					<text class="cost-box-item-text" style="padding-top:10px">{{zhLan1.forget_password_show}}</text>
				</div>
         <div style="align-items:center;">
						<wxc-button size="big" :text="zhLan.confirm"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin-top:10px; text-align:center" @wxcButtonClicked="ensureTransfer" :disabled="judgeIsDisabled"></wxc-button>
					</div>
            </div>
        </div>
    </wxc-popup>
  </div>

</template>

<script>
import { WxcButton, WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, Utils, WxcProgress} from 'weex-ui';
import { checkPassword} from "./utils/auth_v2"
import { getPrivateKey, getCurrentAccountInfo, switchAccount} from './utils/account_v2'
import { getRpc, imgSrc, getStorage, abiBinToJsonUrl } from "./utils/config_v2";
import { sign } from './utils/base_v2'
const navigator = weex.requireModule('navigator')
const utils = require('./appUtils')
const dom = weex.requireModule('dom')
const { Api } = require('eosjs');
const storage = weex.requireModule('storage');
const { TextEncoder, TextDecoder } = require('text-encoding'); 
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const {publicKeyToLegacyString, convertLegacyPublicKey} = require('eosjs/dist/eosjs-numeric')
const modal = weex.requireModule('modal')
const stream = weex.requireModule('stream');
const animation = weex.requireModule('animation')
const globalLan = require('./utils/language/global')
export default {
	components: { WxcButton,WxcMinibar, WxcPopup, WxcDialog, WxcIcon, WxcMask, WxcProgress },
  name: 'App',
  data () {
    return {
        rows: [],
        // dappUrl:"http://192.168.1.7:8080/#/main/vote",
        dappUrl:"",
        scrollerStyle: {},
        fontSize: '35px',
        color: "#ffffff", 
				width: "600px",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor: "#1E90FF",
				imgSrc: imgSrc,
				isConfirmShow: false,
        istransferShow: false,
        dappName:'',
				creator: '',
				creatorPermission: '',
				creatorPubkey: '',
        password: "",
        reqSignData:{},
        popH: 600,
        actions:[{
          account: "eosio",
          name: "voteproducer",
          data: " "
        }],
        signatureProvider:{},
        serializedTransactionUint8Array:{},
        commonApi:{},
        isLoading:false,
        TxMsg:[{
          code:"",
          action:"",
          args:""
        }],
        value: 0,
        interval:{},
        progressVisible:true,
        zhLan: {},
        zhLan1: {},
        globalLan: globalLan,
        chain:{},
        lan: ''
        
    }
  },
  created(){
    console.log("0825 - created ",new Date().getTime())
  },
  async mounted(){
    let startTime = new Date().getTime()
    console.log("0825 - mounted")
    let lan = await getStorage('lan')
    let zhLan = {}
    if(!lan) {
      lan = 'zh-CN'
    }
    this.lan = lan
    this.zhLan = this.globalLan.lang("dapp", lan)
    this.zhLan1 = this.globalLan.lang("tran_sign", lan)
    console.log("0825 - 1 ",new Date().getTime() - startTime)
      // for (let i = 0; i < 80; i++) {
      //   this.rows.push({id: i, name: 'row ' + i})
      // } 
    let param = JSON.parse(await getStorage("dapp"))
    console.log("[0818] param: ", JSON.stringify(param))
    if(param.name){
      if(this.lan == 'en-US') {
        this.dappName = param.name;
      }else {
        this.dappName = param.name;
      }
      
    }else {
      if(this.lan == 'en-US') {
        this.dappName = "Dapp Browser"
      }else {
        this.dappName = "Dapp浏览器"
      }
      
    }
    //查询当前账号
    let account  = JSON.parse(await getStorage("Account"))
    console.log("[0811] account: ", JSON.stringify(account))
    console.log("0825 - 2 ", new Date().getTime() - startTime)
    //获取账号名称
    this.creator = account.account_name;
	let ChainManager = JSON.parse(await getStorage("ChainManager"))
	console.log("[0818] ChainManager.CurrentChain: ", ChainManager.CurrentChain)
	this.chain = ChainManager
    console.log("0825 - 3 ", new Date().getTime() - startTime)
    //获取账号权限
    // let permissions = account.permissions;
    // permissions.forEach(permission => {
    //   if(permission.perm_name == "active"){
    //     this.creatorPermission = "active"
    //     //获取active账号公钥
    //     // this.creatorPubkey = permission.required_auth.keys[0].key;        
    //     this.creatorPubkey = account.localPublicKey;
    //   }
    // });
    // if(this.creatorPermission == ""){
    //   this.creatorPermission = "owner"
    //   //获取owner账号公钥
    //   // this.creatorPubkey = permissions[0].required_auth.keys[0].key;
    //     this.creatorPubkey = account.localPublicKey;
    // }
	
	let allAccountList = JSON.parse(await getStorage("AccountManager_v2"))
  let accountList = allAccountList[this.chain.CurrentChain]
	
	let pubKeyList = []
	let perMissList = []
	//获取用户导入过的公钥
	for (let i = 0; i < accountList.length; i++) {
		pubKeyList.push(accountList[i].PublicKey)
	}
    console.log("0825 - 4 ", new Date().getTime() - startTime)
	//获取当前账号里所有的权限
	for (let i = 0; i < account.permissions.length; i++) {
		for (let j = 0; j < account.permissions[i].required_auth.keys.length; j++) {
			if (pubKeyList.indexOf(account.permissions[i].required_auth.keys[j].key) != -1) {
				let per = {
					pubkey: account.permissions[i].required_auth.keys[j].key,
					per: account.permissions[i].perm_name
				}
				perMissList.push(per)
			}
		}
	}
    console.log("0825 - 5 ", new Date().getTime() - startTime)

	this.creatorPermission = perMissList[0].per
	this.creatorPubkey = perMissList[0].pubkey
  this.dappUrl = param.url + "," + this.creator + "," + this.creatorPubkey + "," + this.creatorPermission;

    console.log("0825 - 6 ", new Date().getTime() - startTime)
    const tabPageHeight = Utils.env.getPageHeight();
    var realHeight = weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750;
    console.log("[0810] tabPageHeight: ", tabPageHeight)
    console.log("[0810] realHeight: ", realHeight)
    let scrollerH = (tabPageHeight) +'px'
    this.scrollerStyle = {
        width:750
    }
    //创建 工具Api，此Api仅用于序列化操作    
    let privateKeys = []
    let privateKey = "5KVQ9WhxWeuF3KsysLgYfjiwYskJsUvvuGv1BNEA6ygJQqQyv6r"
    privateKeys.push(privateKey)
    let commonSignatureProvider = new JsSignatureProvider(privateKeys);
    let rpc = await getRpc(ChainManager.CurrentChain);
    this.commonApi = new Api({ rpc, commonSignatureProvider,textDecoder: new TextDecoder(), textEncoder: new TextEncoder()})

    console.log("0825 - 7 ", new Date().getTime() - startTime)
    // 获取浏览器可视区域高度
    // let clientHeight =   `${document.documentElement.clientHeight}`
    // console.log("[0810]clientHeight: ", clientHeight) 

    setTimeout(() => {
         console.log("页面加载完成")      
         this.createListener();
    }, 5000)
    
    let i = 0;
    this.interval = setInterval(() =>{
      if(this.value < 90){
        let ran = Math.floor((Math.random()*5)+1);
        this.value += ran;
      }else if(this.value == 100){
        return;
      }
      // console.log('[0810] value: ', this.value)
      i++;
      if(i > 64){
        this.value = 100;
        setTimeout(() =>{
          console.log("[0810] interval stop！")
          this.progressVisible = false
          clearInterval(this.interval);//停止
        }, 500)
      }
    },"125");
    console.log("0825 - finish ", new Date().getTime() - startTime)
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
  
  methods:{
    move () {
      var testEl = this.$refs.test;
      animation.transition(testEl, {
        styles: {
          color: '#FF0000',
          transform: 'rotate(90)',
          transformOrigin: 'center center'
        },
        duration: 8000, //ms
        timingFunction: 'ease',
        delay: 0 //ms
      }, function () {
        modal.toast({ message: 'animation finished.' })
      })
    },
    //  popKeyBoard(e) {
    //      console.log("弹出输入框")
    //      console.log(e)
    //      this.keyboardShow = e.isShow
    //      if(e.isShow) {
    //          this.popH = 600 + e.keyboardSize + 100
    //      }else {
    //          this.popH = 600
    //      }
    //  },
      getTxMsg(code, action, binargs, index) {
        const self = this;
        const body = JSON.stringify({code, action, binargs });      
        stream.fetch({
          method: 'POST',
          url: abiBinToJsonUrl,
          type:'json',
          body: body
        }, function(ret) {          
          if(!ret.ok){
            return {
              args:"Network Error!"
            }
          }else{
            let msg = {
              code: self.actions[index].account,
              action:self.actions[index].name,
              args:ret.data.args
            }
            if(self.TxMsg.length == 1 && self.TxMsg[0].action == ""){
              self.TxMsg = []
            }
            self.TxMsg.push(msg)
            if(index == self.actions.length-1){
              self.isConfirmShow = true
              self.isLoading = !self.isLoading
            }
          }
        })
      },
			// 输入密码确认交易
			async ensureTransfer() {
        this.isLoading = !this.isLoading;
        console.log("[0818] ensureTransfer ", this.creatorPubkey, this.chain.CurrentChain,this.password)
        let validPwd = await checkPassword(this.creatorPubkey, this.chain.CurrentChain,this.password)
        let that = this
          if(!validPwd){
              modal.alert({
								message: that.zhLan.incorrect_passwd,
								okTitle: that.zhLan.confirm
              })
              return
        }
        
        let privateKeys = []
        let privateKey = await getPrivateKey(this.password, this.creatorPubkey, this.chain.CurrentChain)
        privateKeys.push(privateKey)
        this.signatureProvider = new JsSignatureProvider(privateKeys);

        let requiredKeys = await this.signatureProvider.getAvailableKeys()
        let chainId = this.reqSignData.chainId + ""
        let signObj = {
          chainId: chainId,
          requiredKeys: requiredKeys,
          serializedTransaction: this.serializedTransactionUint8Array
        }
        console.log("signObj: ", signObj)
        let signature = await this.signatureProvider.sign(signObj)
        let resp = {
            signatures:signature,
            id:this.reqSignData.id
        }
        weex.requireModule('event').returnSignRusult(resp);
        this.isLoading = !this.isLoading;
				// modal.toast({
				// 	message: that.zhLan.trade_sent,
				// 	duration: 4
				// })
        this.istransferShow = false
        this.password = ''        
			},  
			publicKeyFormatter3(publicKey) {
          return publicKey? publicKey.substring(0,3) + "..." + publicKey.substring(publicKey.length-4,publicKey.length): ""
			},
      createListener(){
        var globalEvent = weex.requireModule('globalEvent');
        let that = this;
        globalEvent.addEventListener('reqSign', async function(reqSignData) {
          console.log("收到 签名请求！")
          that.isLoading = !that.isLoading;
          that.reqSignData = reqSignData;
          //重置输入框高度
          // that.popH = 600
          //清空密码          
          that.password = ''        
          that.makeConfirmMsg();          
        });
        
        globalEvent.addEventListener('web_loaded', async function(reqSignData) {
          console.log("页面加载完成，进度条结束！")
          clearInterval(that.interval);//停止
          that.value = 100;
          setTimeout(() =>{
            that.progressVisible = false
          }, 1000)          
        });
      },
      async makeConfirmMsg(){
        //eosjs1兼容
        if(this.reqSignData.requiredKeys.length == 0){
          //格式化交易数据为uint8array 
          console.log("兼容 eosjs1.0")
          let serTxObj = JSON.parse(this.reqSignData.serializedTransaction)
          console.log("serTxObj: " , JSON.stringify(serTxObj))
          this.actions = serTxObj.actions;
          this.serializedTransactionUint8Array = this.commonApi.serializeTransaction(serTxObj)
        }else{
          console.log(" 兼容 eosjs2.0")
          //eosjs2 兼容
          this.reqSignData.requiredKeys = this.reqSignData.requiredKeys.substr(1,this.reqSignData.requiredKeys.length-2)     
          //格式化交易数据为uint8array  
          let hex = this.reqSignData.serializedTransaction;
          if (typeof hex !== "string") {
              throw new Error("Expected string containing hex digits");
          }
          if (hex.length % 2) {
              throw new Error("Odd number of hex digits");
          }
          const l = hex.length / 2;
          const result = new Uint8Array(l);
          for (let i = 0; i < l; ++i) {
              const x = parseInt(hex.substr(i * 2, 2), 16);
              if (Number.isNaN(x)) {
                  throw new Error("Expected hex string");
              }
              result[i] = x;
          }
          this.serializedTransactionUint8Array = result             
          let t2 = this.commonApi.deserializeTransaction(this.serializedTransactionUint8Array)
          let deserializeTransactionStr = JSON.stringify(t2)
          let Tx = JSON.parse(deserializeTransactionStr) 
          this.actions = Tx.actions;                
        }
        //反序列化actions.data数据
        for(var index = 0; index < this.actions.length; index++){
          let action = this.actions[index]
          console.log("action.data: ", action.data)
          //调用RPC接口 abin_bin_to_json
          let params = {
            code:action.account + "",
            action:action.name + "",
            binargs:action.data + ""
          }
          console.log("params: ", JSON.stringify(params))      
          let data = await this.getTxMsg(action.account, action.name, action.data, index)
        }
      },      
			confirmInfo() {
				this.isConfirmShow = false
        this.istransferShow = true
        this.popH = 600
        this.TxMsg = []
			},
			closeConfirmPop() {
        this.isConfirmShow = false
			},
			closeTransferPop() {
				this.istransferShow = false
      },
      
    goBack() {
      const lanSet = new BroadcastChannel('dapp_refresh')
      lanSet.postMessage('refresh')
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    }
  }
}
</script> 

<style scoped>
.main {
    background-color: 	#ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.load_img{
    /* position: relative;
    top: 100px;
    left: 100px; */
  
}
  .box {
    width: 250px;
    height: 250px;
    background-color: #DDD;
  }
.webview {
    position: fixed;
    top: 125px;
    bottom: -10px;
    left: 0;
    right: 0;
}
.webview-div {
    position: fixed;
    top: 120px;
    bottom: -10px;
    left: 0;
    right: 0;
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

    .account-name {
        padding: 20px 0;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid;
        margin-bottom: 10px;
    }
    .account-name-title {
        font-size: 32px;
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
    padding-bottom: 10px;
    border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 

    }
	.password {
    line-height: 48px;
		font-size: 28px;
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
		font-size: 24px;
        padding: 10px 0;
        width: 350px;
        align-content: center;
        text-align: center;
        background-color: #e6fef1;
	}
	.tips-right {
		color: #1E90FF;
		font-size: 28px;
	}
	.btn-box {
    text-align:center;
		margin-top: 50px;
    /* margin-left: 180px;  */
    /* height:200px */
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

    .pop-header  .text{

        font-size: 32px;
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
		/* height: 100px; */
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 10 10px;
	}
  .pop-middle-item4 {
  		height: 100px;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
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
</style>
