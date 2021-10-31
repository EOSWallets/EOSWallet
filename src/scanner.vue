<template>
  <div class="main"  ref="scanner">
        <!-- <div class="navigator">
            <wxc-minibar title="收款" background-color="#FFFFFF" text-color="#4ba363"></wxc-minibar>
        </div> -->
    <div class="navigator">
        <image :src="`${imgSrc}back_blue`"  style="height: 40px;width: 40px;" @click="goBack"></image>
        <text style="font-size: 32px; color: #1E90FF" >{{zhLan.receipt}}</text>
        <image src="" style="height: 40px;width: 40px"></image>
    </div>
    <div class="content">
        <text class="content-title">{{zhLan.scan_title}}</text>
        <div style="width:400px;height:400px">
            <weex-qrcode :text="qrText" :cell="qrCell"></weex-qrcode>
        </div>
        <div class="account">
            <text class="account-title">{{zhLan.account_name}}</text>
            <text class="account-name">{{accountName}}</text>
        </div>

        <div class="foot" @click="copy()">
            <div class="copy-box-item" >
                <text class="copy-box-text">{{zhLan.copy}}</text>
                <!-- <image :src="`${imgSrc}copy`" mode="" style="height: 28px;width: 28px; margin-left: 10px;"></image> -->
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.main {
    background-image: linear-gradient(to bottom right, #1E90FF, #87CEFA);
    align-items: center;
    opacity: 1;
}
.navigator {
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    width: 750px;
    height: 90px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    background-color: #ffffff;
    
}

.content {
    height: 800px;
    width: 650px;
    background-color: #ffffff;
    margin-top: 150px;
    align-items: center;
    border-radius: 20px;
    position: relative;

}
.content-title {
    padding: 40px 0;
    font-size: 28px;
    width: 650px;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.account {
    align-items: center;
    padding: 40px; 
}
.account-title {
    color: gray;
    font-size: 24px;
    padding-bottom: 10px;
}
.account-name {
    font-size: 28px;
    font-weight: bold;
}
.foot {
    position: absolute;
    bottom: 0;
    height: 100px;
    background-color: #f2f3f5;
    width: 650px;
    border-bottom-right-radius:20px;
    border-bottom-left-radius:20px;
    align-items: center;
    justify-content: center;
}
</style>
<script>
import { WxcMinibar, Utils } from 'weex-ui';
import { imgSrc, getStorage } from "./utils/config";
const modal = weex.requireModule('modal')
const clipboard = weex.requireModule('clipboard')
import WeexQrcode from 'weex-qrcode'
const globalLan = require('./utils/language/global')	
  const navigator = weex.requireModule('navigator')
  const utils = require('./appUtils')
export default {
    components: {
		WxcMinibar, WeexQrcode
	},
  	data() {
        return {
            qrText: '',
            qrCell: 400,
            scrollerStyle: {},
            accountName: '',
            imgSrc: imgSrc,
            zhLan: {},
            zhLan1: {},
            globalLan: globalLan
        }
    },
    async beforeCreate() {
        let lan = await getStorage('lan')
        if(!lan) {
            lan = 'zh-CN'
        }
        this.zhLan = this.globalLan.lang("scanner", lan)
        this.zhLan1 = this.globalLan.lang("modal", lan)
    },
    async created() {



        let account = JSON.parse(await getStorage("Account"));
        let qrText = "transfer&"+account.account_name
        this.qrText = qrText
        this.accountName = account.account_name
    },
    async mounted() {

    },
  methods: {
    wxcTabBarCurrentTabSelected(e) {
      const index = e.page;
    },
    copy() {
        clipboard.setString(this.accountName)
        let that = this
        modal.toast({
            message: that.zhLan1.copy_success,
            duration: 2
        })
    },
    goBack() {
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    }
  }
};
</script>