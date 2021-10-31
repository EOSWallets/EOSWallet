<template>
  <div class="main" ref="test" @appear="appear">
    <!-- <div class="navigator">
      <wxc-minibar title="我的" background-color="#FFFFFF" text-color="#4ba363" left-button=""></wxc-minibar>
    </div> -->
  <div class="navigator">
		<image src=""  style="height: 60px;width: 60px;"></image>
		<text style="font-size: 36px; color: #1E90FF" >{{zhLan.my}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
  <div class="choice-box" @click="goAccounts">
      <div class="choice-box-item-left">
          <image :src="`${imgSrc}wallet`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
          <text style="line-height:65px;font-size:32px">{{zhLan.account_manage}}</text>
      </div>
      <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
  </div>
  <div class="choice-box" @click="goNodes">
      <div class="choice-box-item-left">
          <image :src="`${imgSrc}node`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
          <text style="line-height:65px;font-size:32px">{{zhLan.nodes_set}}</text>
      </div>
      <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
  </div>
  <div class="choice-box" @click="changeLan">
	  <div class="choice-box-item-left">
	        <image :src="`${imgSrc}system`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
	        <text style="line-height:65px;font-size:32px">{{zhLan.language_set}}</text>
	    </div>
		<div style="flex-direction: row;align-items: center;">
			<text style="line-height:65px;font-size:32px">{{currentLan}}</text>
			<image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px;"></image>
		</div>
	    
	</div>
  </div>
</template>

<style scoped>
.main {
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

.choice-box {
    width: 750px;
    height: 100px;
    
    padding: 20px;
    line-height: 100px;
    background-color: #ffffff;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
        border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;

}
.choice-box-item {
    flex-direction: row;
    justify-content: space-between;
}
.choice-box-item-left {
    flex-direction: row;
    line-height: 100px;
    
}
</style>
<script>
	import {
		WxcMinibar
  } from 'weex-ui';
  import { imgSrc } from "./utils/config";
import { getStorage } from './utils/config_v2';
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const navigator = weex.requireModule('navigator')
  const storage = weex.requireModule('storage')
  const globalLan = require('./utils/language/global')
  const utils = require('./appUtils')
  

export default {
  components: {
			WxcMinibar
	},
  data() {
    return {
      imgSrc: imgSrc,
      globalLan: globalLan,
      zhLan: {},
      currentLan: '',
    }
  },
  async created() {
    // setTitle("我的")
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
  async mounted() {
    const lanSet = new BroadcastChannel('refresh')
    let that = this
    lanSet.onmessage = async function (event) {
      console.log("获取到返回信息")
      let lan = await getStorage('lan')
      let zhLan = {}
      if(!lan) {
        lan = 'zh-CN'
      }
      if(lan == 'en-US') {
        that.currentLan = "English"
      }else {
        that.currentLan = '简体中文'
      }
    
      that.zhLan = await that.globalLan.lang("my", lan)
    }

  },

  methods: {
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
    goAccounts() {
      navigator.push({
        url: utils.getUrl('accounts.js'),
        animated: "true"
      }, event => {
        console.log('callback: ', event)
      })
      // this.$router.push('/accounts')
    },
    async goNodes() {
      let chainInfos = JSON.parse(await getStorage('ChainManager'))
      let data = {chainName: chainInfos.CurrentChain}
      await storage.setItem("nodes",  JSON.stringify(data))
      navigator.push({
        url: utils.getUrl('nodes.js'),
        animated: "true"
      }, event => {
        console.log('callback: ', event)
      })
    },
    changeLan() {
      navigator.push({
        url: utils.getUrl('language_set.js'),
        animated: "true"
      }, event => {
        console.log('callback: ', event)
      })
    }
  }
};
</script>