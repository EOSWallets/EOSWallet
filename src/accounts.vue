<template>
<div>
    <!-- 顶部导航栏 -->
    <div class="navigator">
        <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
        <text style="font-size: 36px; color: #1E90FF">{{zhLan.accounts_manage}}</text>
		<image :src="`${imgSrc}add`" style="width: 60px;height: 60px" @click="clickAdd"></image>
    </div>
    <!-- 主体内容  -->
    <div :style="bodyStyle" class="wallet-father" >
        <!-- 公链侧栏 -->
        <div class="wallet-left">            
			<scroller>
				<div v-for="(item,index) in chainList" :key="index"
				 :style="chooseIndex != index?walletUnChooseStyle:walletChooseStyle"
				 @click="chooseChain(item,index)">
					<div class="wallet-image">
						<image v-if="chooseIndex != index" :src="`${imgSrc}${unclickIcon[index]}`" style="height: 60px;width: 60px" ></image>
						<image v-if="chooseIndex == index" :src="`${imgSrc}${clickIcon[index]}`" style="height: 60px;width: 60px" ></image>
					    <div v-if="chooseIndex == index" class="wallet-left-name">{{chainList[index]}}</div>
                    </div>
				</div>
			</scroller>
        </div>
        <div class="wallet-right" >
			<scroller>
            <!-- 账号块 -->
            <div  v-for="(item,index) in accountList" :key="index" @click="clickAccountBlock(item)">
                <div class="wallet-item" v-if="item.chain == chainList[chooseIndex]">
                    <div class="wallet-item-line account-name" style="margin-top:12px;">
                        <text class="account-name-acount">{{item.account_name}}</text>
                        <image :src="`${imgSrc}copy_white`" style="height: 28px;width: 28px" ></image>
                        <text class="account-name-now" v-if="item.account_name == nowAccount.account_name && selectedAccount.chain == item.chain">{{zhLan.current}}</text>
                        <image class="account-arrow" :src="`${imgSrc}arrow_right`" style="height: 28px;width: 28px" ></image>
                    </div>
                    <text class="wallet-item-pubkey" style="color: #828384; margin-left:6px; margin-top:-6px">{{dealPubKey(item.publickey)}}</text>
                    <!-- <div class="wallet-item-line"><text class="iconNum">{{item.balance}} {{chainList[chooseIndex]}}</text> </div> -->
                </div>
            </div>
			</scroller>
            <!-- 添加账号 虚框 -->
            <!-- <div class="wallet-item-add" v-if="accountList">

            </div> -->
        </div>
        <!-- 添加按钮 弹出框 -->
        <wxc-popup 
            :show="showPop"
            @wxcPopupOverlayClicked="closePop"
            pos="bottom"
            height="390">
        <div>
            <div class="pop-header">
                <text class="text" style="font-size: 32px;font-weight: bold;">{{zhLan.add_account}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closePop"></image>
            </div>
            <div class="pop-middle">
                <div class="pop-middle-item" @click="createAccount">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.create_account}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="importPreKey">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.import_prikey}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="addPriKey">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.new_privatekey}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
            </div>
        </div>
        </wxc-popup>
        <!-- 账号块点击 弹出框 -->
        <wxc-popup 
            :show="showAccountPop"
            @wxcPopupOverlayClicked="closeAccountPop"
            pos="bottom"
            height="520">
        <div>
            <div class="pop-header">
                <text class="text" style="font-size: 32px;font-weight: bold;">{{zhLan.accounts_manage}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closeAccountPop"></image>
            </div>
            <div class="pop-middle">
                <div class="pop-middle-item" @click="goBackup">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.backup_priley}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="jumpAuthority">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.authority_manage}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="goModifyPwd">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.alter_password}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="delAccount">
                    <div>
                        <text class="pop-middle-item-text">{{zhLan.del_account}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <!-- <div class="pop-footer" @click="deletePeivateKey">
                    <text class="pop-footer-text">{{zhLan.delprikey}}</text>
                </div> -->
            </div>
        </div>
        </wxc-popup>

    </div>
</div>
</template>

<style scoped>
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
        font-size: 32px;
        font-weight: bold;
    }
    .pop-middle {
        height: 580px;
        padding: 0 20px;
    }
    .pop-middle-item {
        height: 90px;
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
	.navigator {
    	border-bottom-width: 1px;
		border-bottom-color: #F1F3F5;
		border-bottom-style: solid;
		width: 750px;
        height: 120px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        background-color: #ffffff;
	}    
	.wallet-father {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: stretch;
		/* height: 160px; */
	}
	.wallet-left {
		align-content: center;
		background-color: #F1F3F5;
		width: 120px;
		display: inline-block; 
		vertical-align: middle;
	}
    .wallet-left-name {
        font-size: 18px;
        font-weight: bold;
        margin-left: 10px;
    }
	.wallet-right {
		align-content: center;
		background-color: #ffffff;
		width: 630px;
		display: inline-block; 
		vertical-align: middle;
	}
	.wallet-image{
		margin-left: 30px;
	}
    .wallet-item {
        /* float: left; */
        margin: 15px 30px;
        height: 160px;
		border-radius: 15px;
        color: #FFFFFF;
        background-color: #3A3B3D;
    }
    .wallet-item-line {
        font-size: 24px;
        color: #FFFFFF;
        line-height: 24px;
        padding: 12px 16px;
    }
    .wallet-item-pubkey {
        font-size: 24px;
        line-height: 24px;
        padding: 12px 16px;
    }
    .iconNum{
        position: absolute;
        right: 20px;
        bottom: 3px;
        color: #FFFFFF;
        line-height: 22px;
        font-size: 22px;
        width: auto;
    }
    .account-name{
        display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: stretch;
    }
    .account-name-acount{
        color:#FFFFFF; 
        font-size:28px;
        line-height: 28px;
        font-weight: bold;  
        padding: 6px;
    }
    .account-name-now {
        color:#FFFFFF; 
        font-size:16px; 
        line-height: 22px;
        margin-left:10px;
		border-radius: 13px;
        padding: 6px;
        color: #000000;
        background-color: #FFFFFF;
    }
    .account-arrow{
        position: absolute;
        right: 20px;
        bottom: 14px;
        line-height: 22px;
        font-size: 22px;
    }
</style>
<script>
import {WxcMinibar, WxcPopup, WxcDialog, Utils} from 'weex-ui';
import {getAssets,updateAssets} from './utils/asset_v2'
import {switchAccount, delLocalKey, getAccountByPublicKey, addLocalAccount, getCurrentAccountInfo} from './utils/account_v2'
import {imgSrc, getStorage, chainList} from './utils/config_v2'
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')
const animation = weex.requireModule('animation')
const navigator = weex.requireModule('navigator')
const utils = require('./appUtils')
const globalLan = require('./utils/language/global')
export default {
  components: {
  	WxcMinibar, WxcPopup, WxcDialog
  },    
  data() {
      return {
		walletChooseStyle:{
			"height": "110px",
			"background-color": "#fff",
			"align-items": "center",
			"flex-direction": "row",
		},
		walletUnChooseStyle:{
			"height": "110px",
			"background-color": "#F1F3F5",
			"align-items": "center",
			"flex-direction": "row",
		},
		unclickIcon:["tnt","yas","eos"],
		clickIcon:["tnt","yas","eos"],
		chainList:[
			"EOS"
			// "TNT","YAS","EOS"
		],
        imgSrc: imgSrc,
        bodyH: '',
        bodyStyle: {
            height:'760px'
        },
        currentWallet:"EOS",
        chooseIndex:"0",
        accountList:[],
        showPop:false,
        showAccountPop:false,
        showAddBlock:false,
        currentAccount:{},
        nowAccount:{},
        globalLan:globalLan,
        zhLan:{},
		modalLan:{},
        selectedAccount:{}
      }
  },
  beforeCreate() {
  },
  async created() {
	console.log("[0819] account create")
    const tabPageHeight = Utils.env.getPageHeight();
    this.bodyH = (tabPageHeight+120) +'px'
    this.bodyStyle = {
        height: this.bodyH
    }
    //语言包
    console.log("0819 accounts create 获取语言包")
    let lan = await getStorage('lan')
    let zhLan = {}
    if(!lan) {
      lan = 'zh-CN'
    }

    this.zhLan = await this.globalLan.lang("accounts", lan)
    this.modalLan = await this.globalLan.lang("modal", lan)
    //获取账号    
    this.accountList = []  
    let accounts = JSON.parse(await getStorage("AccountManager_v2"))
    for(var i = 0; i < this.chainList.length; i++){
        let chainAccounts = accounts[this.chainList[i]]
        // console.log("chainAccounts: ", chainAccounts)
        for(var j = 0; j < chainAccounts.length; j++){
            let pubKeyObj = chainAccounts[j]
            // console.log("pubKeyObj: ", pubKeyObj)
            for(var k = 0; k < pubKeyObj.Accounts.length; k++){
                let account = {
                    chain:this.chainList[i],
                    account_name:pubKeyObj.Accounts[k].Account,
                    publickey:pubKeyObj.PublicKey,
                    balance:pubKeyObj.Accounts[k].Balance
                }
                this.accountList.push(account)
            }
        }
    }
    //获取当前账号
    let nowAccount = JSON.parse(await getStorage("Account"))
    this.nowAccount = nowAccount;
    this.selectedAccount.account_name = nowAccount.account_name;
    let chain = JSON.parse(await getStorage("ChainManager"))
    this.selectedAccount.chain = chain.CurrentChain;
  },
  async mounted() {
    const lanSet = new BroadcastChannel('account_refresh')
    let that = this
    lanSet.onmessage = async function (chainName) {
        console.log("[0821] account_refresh: ", chainName.data)
        if(chainName.data.length == 0){
            chainName.data = that.chainList[0];
        }
        let chainIndex = -1;
        for(var i = 0; i < that.chainList.length; i++){
            if(chainList[i] == chainName.data){
                chainIndex = i;
            }
        }
        if(chainIndex != -1){
            that.chooseIndex = chainIndex
        }else{            
            that.chooseIndex = 0
        }
        
        that.accountList = [];
        let tempArray = [];
        let accounts = JSON.parse(await getStorage("AccountManager_v2"))
        let index = 0;
        for(var i = 0; i < that.chainList.length; i++){
            let chainAccounts = accounts[that.chainList[i]]
            for(var j = 0; j < chainAccounts.length; j++){
                let pubKeyObj = chainAccounts[j]
                for(var k = 0; k < pubKeyObj.Accounts.length; k++){
                    let account = {
                        chain:that.chainList[i],
                        account_name:pubKeyObj.Accounts[k].Account,
                        publickey:pubKeyObj.PublicKey,
                        balance:pubKeyObj.Accounts[k].Balance
                    }
                    that.accountList.splice(index, 1, account) 
                    index++;
                }
            }
        }
        console.log("[0819] 页面刷新结束 that.accountList: ", JSON.stringify(that.accountList))
    }    
  },
  computed: {
      
  },
  methods: {
    async getAccountBalance(){        
		let assets = await getAssets(this.account.account_name, chain.CurrentChain);
    },
    async renderAccounts(){
        this.accountList = []
        let accounts = JSON.parse(await getStorage("AccountManager_v2"))
        for(var i = 0; i < this.chainList.length; i++){
            let chainAccounts = accounts[this.chainList[i]]
            for(var j = 0; j < chainAccounts.length; j++){
                let pubKeyObj = chainAccounts[j]
                for(var k = 0; k < pubKeyObj.Accounts.length; k++){
                    let account = {
                        chain:this.chainList[i],
                        account_name:pubKeyObj.Accounts[k].Account,
                        publickey:pubKeyObj.PublicKey,
                        balance:pubKeyObj.Accounts[k].Balance
                    }
                    this.accountList.push(account)
                }
            }
        }
		console.log("accountList:",this.accountList)
    },
	chooseChain(item,index){
        console.log("选择公链: ", JSON.stringify(item))
		this.currentWallet = item
        this.chooseIndex = index
        
	},
    dealPubKey(key){
        return key.substring(0, 7) + "..." + key.substring(key.length - 6, key.length);
    },
    clickAdd(){
        console.log("Add!")
        this.showPop = true;
    },
    async clickAccountBlock(account) {
        await storage.setItem("account_detail",  JSON.stringify(account))
        navigator.push({
            url: utils.getUrl('account_detail.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        this.chooseIndex = -1;
        this.showPop = false;
    },
    closePop () {
      this.showPop = false;
    },
    closeAccountPop(){
      this.showAccountPop = false;
    },
    createAccount() {
        this.chooseIndex = -1;
        this.showPop = false;
        navigator.push({
            url: utils.getUrl('create_account.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    importPreKey() {
        this.chooseIndex = -1;
        this.showPop = false;
        navigator.push({
            url: utils.getUrl('private_key_import.js'),
            animated: "true"
        }, event => {
            console.log('callback: 11111', event)
        })
    },
    addPriKey() {
        this.chooseIndex = -1;
        this.showPop = false;
        navigator.push({
            url: utils.getUrl('private_key_create.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    async goBackup() {
        let data = {publicKey:this.currentAccount.publickey, chainName:this.chainList[this.chooseIndex]}
        await storage.setItem("private_key_backup",  JSON.stringify(data))
        
        this.chooseIndex = -1;
        this.showAccountPop = false;                
        navigator.push({
            url: utils.getUrl('private_key_backup.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
	goBack() {
		const lanSet = new BroadcastChannel('account_home')
        lanSet.postMessage('refresh')
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })	
	}
  }
};
</script>