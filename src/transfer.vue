<template>
<div class="body" ref="transfer">
    <div class="navigator">
        <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
        <text style="font-size: 36px; color: #1E90FF" >{{zhLan.transfer}}</text>
        <image src="" style="height: 40px;width: 40px"></image>
    </div>

    <div class="main">
        <div class="note">
            <text class="note-left">{{zhLan.tranin_account}}</text>
        </div>
        <div>
            <div><input type="text" v-model="receiver" :placeholder="zhLan.receiver_account" class="password"></div>
        </div>
    </div>

    <div class="main">
        <div  class="note">
            <text class="note-left">{{zhLan.tran_count}}</text>
            <div class="note-right"  @click="openCurrencyPop">
                <text style="font-size:32px;">{{symbol}}</text>
                <image :src="`${imgSrc}right`"  style="height: 32px;width: 32px;"></image>
            </div>
        </div>
        <div>
            <div><input type="number" v-model="amount" :placeholder="zhLan.tranout_money" class="password"></div>
            <div style="flex-direction:row; justify-content:space-between; margin-top:30px">
                <text class="gray">{{zhLan.currency_balance}}</text>
                <text class="green">{{currentBalance}} {{symbol}}</text>
            </div>
        </div>
    </div>

    <div class="main">
        <div class="note">
            <text class="note-left">{{zhLan.remark}}</text>

        </div>
        <div>
            <div><input type="text" v-model="remark" :placeholder="zhLan.remark_info" class="password"></div>
            <text class="tips">{{zhLan.remark_tips}}</text>
        </div>
    </div>
    <div style="align-items:center">
    <div class="btn-box" style="width:710px" >
        <wxc-button size="big" :text="zhLan.confirm"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureInput" :disabled="judgeIsDisabled"></wxc-button>
    </div>
    </div>


    <wxc-popup 
        :show="isCurrencyShow"
        @wxcPopupOverlayClicked="closeCurrencyPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="800">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.choose_coin}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeCurrencyPop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller">
                    <div class="list">
                        <div class="list-item" v-for="(item,index) in assets" :key="index" @click="chooseCurrency(item.name)">
                            <div class="list-item-left">
                                <img :src="`${imgSrc}yas`" alt="" style="height: 50px;width: 50px; margin: 0 30px 0 10px">
                                <div>
                                    <div><text class="coin-title">{{item.name}}</text></div>
                                    <!-- <div><text class="coin-value">0.0001￥</text></div> -->
                                </div>	
                            </div>					

                                <div>
                                    <image :src="`${imgSrc}right`"  style="height: 32px;width: 32px;"></image>
                                    <!-- <div><text class="coin-title-right">{{item.value}}</text></div> -->
                                    <!-- <div><text class="coin-value">45￥</text></div> -->
                                </div>
                        </div>
                    </div>
                </scroller>
            </div>
        </div>
    </wxc-popup>

	<!-- 转账信息确认dialog -->
	<wxc-popup 
        :show="isConfirmShow"
        @wxcPopupOverlayClicked="closeConfirmPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff"
        height="900">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.tran_confirm}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeConfirmPop"></image>
            </div>
            
            <div class="pop-middle">
                    <div class="pop-middle-item" @click="createByself">
						<text style="font-size:36px; font-weight:bold">- {{amount}} {{symbol}}</text>
                    </div>


					<div class="transfer-box">
						<div class="transfer-item">
							<text class="transfer-item-left">{{zhLan.pay_info}}</text>
							<text class="transfer-item-right">{{symbol}} {{zhLan.transfer}}</text>
						</div>
						<div  class="transfer-item">
							<text class="transfer-item-left">{{zhLan.tranin_account}}</text>
							<text class="transfer-item-right">{{receiver}}</text>
						</div>
						<div  class="transfer-item">
							<text class="transfer-item-left">{{zhLan.tranout_account}}</text>
							<text class="transfer-item-right">{{currentAccountName}}</text>
						</div>
                        <div  class="transfer-item">
							<text class="transfer-item-left">{{zhLan.remark}}</text>
							<text class="transfer-item-right">{{remark}}</text>
						</div>
					</div>
					<div class="btn-box">
						<wxc-button size="big" :text="zhLan.confirm"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="confirmTransfer"></wxc-button>
					</div>
            </div>
        </div>
    </wxc-popup>

    
	<wxc-popup 
        :show="istransferShow"
        @wxcPopupOverlayClicked="closeTransferPop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        style="background-color:#fff;"
       :height="popH">
        <!-- <scroller style="height:600px">
            <div class="pop-header">
                <text class="text">{{zhLan1.trans_sign}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeTransferPop"></image>
            </div>
            
            <div class="pop-middle">
                <div class="middle-top">
                    <div style="justify-content:center; align-items:center;">
                        <text style="font-size:32px;">{{currentAccountName}} @{{currentpermission}}</text>
                    </div>
                </div>

				<div style="flex-direction:row; margin-bottom:20px">
					<text style="font-size:32px;">{{zhLan1.enter}}</text>
					<text style="background-color:#1E90FF;padding:5px;font-size:32px;;color:#ffffff">{{publicKeyFormatter(currentPubkey)}}</text>
					<text style="font-size:32px;">{{zhLan1.ofprikey_password}}</text>
				</div>

				<div class="password-item">
					<input type="password" v-model="password" :placeholder="zhLan1.this_password" class="password" @keyboard="popKeyBoard">
				</div>

				<div>
					<text class="tips" style="padding-top:10px">{{zhLan1.forget_password_show}}</text>
				</div>
				<div class="btn-box">
					<wxc-button size="big" :text="transBtn"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureTransfer" :disabled="transDisabled"></wxc-button>
				</div>
            </div>
        </scroller> -->
		<div style="width:750px"><sign-util/></div>
    </wxc-popup>
    <wxc-loading :show="isShow" type="default" :need-mask="true" ></wxc-loading>
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar, WxcPopup, WxcIcon, WxcLoading} from 'weex-ui';
    const modal = weex.requireModule('modal');
    const storage = weex.requireModule('storage');
    import {getPrivateKey, getCurrentAccountInfo, getLocalAccount, saveTransInfo} from "./utils/account_v2"
    import { checkPassword} from "./utils/auth_v2"
    import { transfer, getCurrencyBalance } from './utils/eos_v2'
    import { getStorage, imgSrc} from './utils/config_v2'
    import moment from 'moment'; 
	import SignUtil from "./sign_util"
    const globalLan = require('./utils/language/global')	
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
	export default {
		components: { WxcButton,WxcMinibar, WxcPopup, WxcIcon, WxcLoading,SignUtil },
		data() {
			return {
                imgSrc: imgSrc,
				width: "80%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
                color: "#ffffff", 
                isCurrencyShow: false,
                istransferShow: false,
                isConfirmShow: false,
                publicKey: "",
                receiver: '',
                amount: 0,
                remark: '',
                password: '',
                account: {},
                currentAccount: {},
                currentpermission: '',
                currentAccountName: '',
                currentPubkey: '',
                symbol: '',
                currentBalance: 0,
                currencyAccount: {},
                transDisabled: false,
                transBtn: '确定',
                isShow: false,
                assets:[],
                chain:{},
                keyboardShow: false,
                popH: 600,
                zhLan: {},
                zhLan1: {},
                zhLan2: {},
                zhLan3: {},
                globalLan: globalLan
			};
        },
        destroyed() {
           storage.removeItem("transfer") 
        },
        async beforeCreate() {
            this.account = JSON.parse(await getStorage("Account"))
            this.currentAccountName = this.account.account_name
            if( this.account.permissions.length > 1) {
                this.currentpermission = 'active'
                for (let index = 0; index < this.account.permissions.length; index++) {
                    if(this.account.permissions[index].perm_name == 'active') {
                        // this.currentPubkey = this.account.permissions[index].required_auth.keys[0].key
                        this.currentPubkey = this.account.localPublicKey;
                        break
                    }   
                }
            } else {
                this.currentpermission = this.account.permissions[0].perm_name
                // this.currentPubkey = this.account.permissions[0].required_auth.keys[0].key
                this.currentPubkey = this.account.localPublicKey;
            }

        },
        async created() {
            // if(typeof(getStorage("transfer")) == 'string') {
            //    let data = JSON.parse(await getStorage("transfer"))
            //    console.log("毕总1",data)
            //    this.receiver = data.rece
            //    this.symbol = data.symbol
            // }
            storage.getItem("transfer", res =>{
                console.log("获取缓存:",JSON.stringify(res))
                let authoritySt = JSON.parse(res.data)
				this.receiver = authoritySt.rece
                this.symbol = authoritySt.symbol
			})
            console.log("毕总",this.symbol)
            // if(this.$route.query.symbol){
              
            //   console.log("[transfer] symbol: ", this.symbol)
            // }

            let assets = JSON.parse(await getStorage("assets"))
            let chain = JSON.parse(await getStorage("ChainManager"))
            this.assets = assets[chain.CurrentChain + "_" + this.account.account_name]
            console.log("[transfer] assets: ", this.assets)
            this.chain = chain;

            
            this.getCurrencyBalance()
            this.currencyAccount = getLocalAccount(this.account.account_name, this.account.localPublicKey, chain.CurrentChain);
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
				// if(!this.password) {
				// 	return true
				// }
				// return false
			},
		},
		watch: {

        },
    async mounted() {
        let lan = await getStorage('lan')
        if(!lan) {
            lan = 'zh-CN'
        }
        this.zhLan = this.globalLan.lang("transfer", lan)
        this.zhLan1 = this.globalLan.lang("tran_sign", lan)
        this.zhLan2 = this.globalLan.lang("modal", lan)
        this.zhLan3 = this.globalLan.lang("button", lan)
    },
		methods:{
            popKeyBoard(e) {
                console.log("弹出输入框")
                console.log(e)
                this.keyboardShow = e.isShow
                if(e.isShow) {
                    this.popH = 600 + e.keyboardSize + 100
                }else {
                    this.popH = 600
                }
            },
            async getCurrencyBalance() {
                
                this.currentBalance = await getCurrencyBalance(this.currentAccountName, this.symbol)
            },
            goBack() {
                const assetsSet = new BroadcastChannel('assets_refresh')
        		assetsSet.postMessage('refresh')
                navigator.pop({
                        animated: "true"
                    }, event => {
                        console.log('callback: ', event)
                })
            },
            chooseCurrency(item) {
                this.symbol = item
                this.getCurrencyBalance()
                this.isCurrencyShow = false
            },
            publicKeyFormatter(publicKey) {
                return publicKey? publicKey.substring(0,3) + "..." + publicKey.substring(publicKey.length-4,publicKey.length): ""
			},
            async openCurrencyPop() {
                this.isCurrencyShow = true
            },
            closeCurrencyPop () {
                this.isCurrencyShow = false;
            },
            closeTransferPop () {
                this.password = ""
                this.istransferShow = false
            },
            closeConfirmPop() {
                this.isConfirmShow = false
            },

			async ensureInput(e) {
                console.log("[0815] ensureInput")
                let that = this
                const { type, disabled } = e;
                console.log("type, disabled : ", type, disabled)
				if(disabled) {
					return
                }
                // this.amount = parseFloat(this.amount)
                if(this.receiver == ""){
                    modal.toast({
                        message: that.zhLan2.receive_account_notnull,
                        duration: 2
                    })
                    return
                }
                //取消接收账号检查，可能存在当前使用的节点无法查询账号问题
                let result = await getCurrentAccountInfo(this.receiver, this.chain.CurrentChain)
                if(JSON.stringify(result) == "{}") {
                    modal.toast({
                        message: that.zhLan2.receive_account_noexist,
                        duration: 2
                    })
                    return
                }
                if(this.amount == 0){
                    modal.toast({
                        message: that.zhLan2.trancount_notzreo,
                        duration: 2
                    })
                    return
                }
                this.amount = this.getFloat(this.amount, 4)
                console.log("输入金额："+parseFloat(this.amount))
                console.log("当前余额："+this.currentBalance)
                if(parseFloat(this.amount) > parseFloat(this.currentBalance)){
                    modal.toast({
                        message: that.zhLan2.trancount_notbigger,
                        duration: 2
                    })
                    return
                }
                if(parseFloat(this.amount) < parseFloat(0.0001)){
                    modal.toast({
                        message: that.zhLan2.trancount_notless,
                        duration: 2
                    })
                    return
                }
                
                this.isConfirmShow = true
            },

            confirmTransfer() {
                this.isConfirmShow = false
                this.popH = 600
                //this.istransferShow = true
				this.openSign()
            },
			openSign(){
					  let signData ={accountName:this.account.account_name,chainName:this.chain.CurrentChain}
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
						that.istransferShow = false
						that.currentpermission = signData.permission
						that.currentPubkey = signData.pubkey
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
                console.log("[0815] ensureTransfer")
                this.transBtn = this.zhLan3.processing
                this.transDisabled = true
                let that = this
                console.log("[0818] ", this.currentPubkey, this.chain.CurrentChain, this.password)
				let validPwd = await checkPassword(this.currentPubkey, this.chain.CurrentChain, this.password)
                console.log("[0815] 00000000000")
                if(!validPwd){
                    modal.toast({
                        message: that.zhLan2.password_notmatch,
                        duration: 2
                    })
                    this.transBtn = this.zhLan3.confirm
                    this.transDisabled = false  
                    return
                }
                console.log("[0815] 1111111111")
                
                let result = await transfer(this.currentAccountName, this.receiver, this.symbol, this.amount, 
                    this.remark, this.currentPubkey, this.currentpermission, this.password, this.chain.CurrentChain)
                if(JSON.stringify(result) == "{}") {
                    modal.toast({
                        message: that.zhLan2.tran_fail,
                        duration: 2
                    })
                    this.transBtn = this.zhLan3.button.confirm
                    this.transDisabled = false  
                    return
                }
                console.log("[0815] 222222222222")
                let form = {
                    account_name: this.currentAccountName,
                    receiver: this.receiver,
                    symbol: this.symbol,
                    tran_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    remark: this.remark,
                    trans_no:result.transaction_id,
                    icon:"tranout",
                    amount: this.amount
                }
                await saveTransInfo(form)
                modal.toast({
                    message: that.zhLan2.tran_success,
                    duration: 2
                })

                // 向首页发起刷新通信
                const assetsSet = new BroadcastChannel('assets_refresh')
        		assetsSet.postMessage('refresh')
                navigator.pop({
                        animated: "true"
                    }, event => {
                        console.log('callback: ', event)
                })
                await this.getCurrencyBalance()
                
                this.istransferShow = false,
                this.password = ""
                this.transBtn = this.zhLan3.confirm
                this.transDisabled = false   
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
	}
</script>

<style scoped >
.body {
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
		width: 750px;
        height: 100px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        background-color: #ffffff;
	}
	.main {
		padding: 30px 40px;
        background-color: #fff;
        justify-content: center;
        margin: 10px 0;
	}

    .note {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 20px 0;
    }
	.note-left {
		font-size: 32px;
		
        font-weight: bold;
	}
    .note-right {
        flex-direction: row;
        align-items: center;
        padding: 10px;
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

    .gray {
        font-size: 28px;
        color: gray;
        font-weight: bold;
    }
    .green {
        font-size: 28px;
        color: #1E90FF;
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
        padding: 10px 0;
        font-size:28px;;
        letter-spacing: 2px;
        color:gray;
    }

    .text{

        font-size: 36px;
        font-weight:bold;
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
    .transfer-box {
        padding: 0 40px;
    }
    .transfer-item {
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 30px 0;
        flex-direction: row;
        align-items: center;
    }
    .transfer-item-left {
        width: 200px;
        font-size: 36px;
        font-weight: bold;
        color: gray;
    }
    .transfer-item-right {
        font-size: 36px;
    }
    .scroller {
        height: 680px;
    }
    .list-item {
		height: 120px;
		border-width: 1px;
		border-color: #C0C0C0;
		border-style: solid;
		margin: 10px 10px;
		padding: 20px;
		line-height: 120px;
		border-radius: 10px;
		/* box-shadow:2px 2px 4px -1px gray; */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		
	}
    .list-item-left {
		flex-direction: row;
        align-items: center;
	}
	.coin-title {
		font-size: 36px;
		font-weight: bold;
	}
    .coin-title {
		font-size: 36px;
		font-weight: bold;
        right:0
	}
	.coin-value {
		font-size:32px;;
		color: grey;
		text-align: right;
		margin-top: 10px;
	}
</style>
