<template>
  <div class="main" ref="test">
    <!-- <div class="navigator">
      <wxc-minibar title="我的" background-color="#FFFFFF" text-color="#4ba363" left-button=""></wxc-minibar>
    </div> -->
  <div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color:#1E90FF" >{{title}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
  <scroller :style="scrollerStyle">
      <div class="choice-box" @click="goDapps(item)" v-for="(item, index) in dapps" :key="index">
        <image :src="item.img_src" mode="" style="height: 100px;width: 100px; margin-right: 20px; border-radius:30px"></image>
        <div>
          <text class="content-name">{{lan=='en-us'?item.dapp_name_eng:item.dapp_name_chn}}</text>
        </div>
      </div>
  </scroller>

  </div>
</template>

<style scoped>
.main {
    background-color: 	#ffffff;
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
    height: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #ffffff;
}

.choice-box {
    width: 750px;
  
    
    padding: 20px;
    line-height: 100px;
    background-color: #ffffff;
    flex-direction: row;
    align-items: center;
        border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;

}
.choice-box-item {
    flex-direction: row;
}
  .content-name {
      font-size: 32px;
      font-weight: bold;
  }
</style>
<script>
	import {
		WxcMinibar,Utils
  } from 'weex-ui';
  import { imgSrc, getStorage } from "./utils/config";
import { savedapps } from './utils/account';
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const storage = weex.requireModule('storage')
  import { saveHistoryVisit} from "./utils/account"
  import{dappList} from "./utils/dapps"
  const navigator = weex.requireModule('navigator')
  const utils = require('./appUtils')
export default {
    components: {
			WxcMinibar
		},
  	data() {
			return {
        imgSrc: imgSrc,
        dapps: [],
        title: '',
        scrollerStyle: {},
        chainName: '',
        lan: ''
			}
		},
  async created() {
    let chainManager = JSON.parse(await getStorage('ChainManager'))
    let chainName = chainManager.CurrentChain
    this.chainName = chainName
    let lan = await getStorage('lan')
    let zhLan = {}
    if(!lan) {
      lan = 'zh-CN'
    }
    this.lan = lan
    let data = JSON.parse(await getStorage('dappList'))
    if(data.type && data.type == 'my') {
      if(this.lan == "en-US") {
        this.title = 'My Dapps'
      }else {
        this.title = '我的Dapps'
      }
      this.dapps = JSON.parse(await getStorage(this.chainName+'_MyDapps'))
    }

    if(data.type && data.type == 'dapps') {
      if(data.title) {
        this.title = data.title
      }
      if(data.apps) {
        this.dapps = data.apps
      }
    }
    
    const tabPageHeight = Utils.env.getPageHeight();
    this.scrollerStyle = { height: (tabPageHeight+100) + 'px' };

  },
  methods: {
    async goDapps(item) {
        let form = {
            name: item.name,
            url: item.url
        }

        saveHistoryVisit(form)
        let data = {url: item.url, name:item.name}
        await storage.setItem("dapp",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        // this.$router.push({path:'/dapp',query:{url:item.url}})
    },
    goBack() {
      navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
      })
    },
  }
};
</script>