<template>
  <wxc-tab-bar :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               title-type="icon"
               :support-x-bar="true"
               style="position:fixed;top:0;bottom:0;"
               timing-function="null"
               duration='0'
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <div :style="contentStyle" class="content"><home :heights="contentHeight"/></div>
    <div :style="contentStyle" class="content"><dapp-index :heights="contentHeight"/></div>
    <div :style="contentStyle" class="content"><my/></div>
  </wxc-tab-bar>
</template>

<style scoped>
.content {
    overflow-y:scroll;
    width: 750px;
}
</style>
<script>
  import { WxcTabBar, Utils } from 'weex-ui';
  import home from './home'
  import my from './my'
  import dappIndex from './dapp_index'
  import Config from './config'
  import { getStorage } from './utils/config'
import {getLan} from "./utils/language/language"
  const globalLan = require('./utils/language/global')
  export default {
    name: 'App',
    components: { WxcTabBar, home, my,dappIndex},
    data(){
      return {
      tabTitles: {},
      tabStyles: Config.tabStyles,
      contentStyle: {},
      contentHeight: 0,
      globalLan: globalLan
      }

    },
    async created () {
      const tabPageHeight = weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750
      const { tabStyles } = this;
      console.log("index页面高度"+ tabPageHeight)
      this.contentHeight = tabPageHeight;
      let lan = await getStorage('lan')
			if(!lan) {
				lan = 'zh-CN'
      }
      
      if(lan == "en-US") {
        this.tabTitles = Config.tabEnTitles
      } else {
        this.tabTitles = Config.tabTitles
      }
      // const tabPageHeight = Utils.env.getPageHeight();
      // 如果页面没有导航栏，可以用下面这个计算高度的方法
      // this.contentStyle = { height: (tabPageHeight - tabStyles.height) + 'px' };
    },
    async mounted() {
      const lanSet = new BroadcastChannel('refresh')
      let that = this
      lanSet.onmessage = async function (event) {
        let lan = await getStorage('lan')
        let zhLan = {}
        if(!lan) {
          lan = 'zh-CN'
        }
        if(lan == "en-US") {
          that.tabTitles = Config.tabEnTitles
        } else {
          that.tabTitles = Config.tabTitles
        }
      }
    },
    methods: {
      wxcTabBarCurrentTabSelected (e) {
        const index = e.page;
        // console.log(index);
      }
    }
  };
</script>