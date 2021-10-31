<template>
    <div class="main" ref="sourceM">
      	<!-- <div class="navigator">
            <wxc-minibar title="资源管理" background-color="#FFFFFF" text-color="#4ba363"
            @wxcMinibarLeftButtonClicked="goBack"></wxc-minibar>
        </div> -->
        <div class="navigator">
            <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
            <text style="font-size: 36px; color: #1E90FF;" >{{zhLan.manage}}</text>
            <image src="" style="height: 60px;width: 60px"></image>
        </div>
        <div class="top-tab-box">
            <div class="top-tab-item" @click="changePage(0)">
                <text :class="['top-tab-text', currentPage==0? 'top-tab-selected':'']">{{zhLan.add}}</text>
            </div>
            <div class="top-tab-item" @click="changePage(1)">
                <text :class="['top-tab-text', currentPage==1? 'top-tab-selected':'']">{{zhLan.ransom}}</text>
            </div>
        </div>
        <div>
            <div style="width:750px;"><source-manage-add v-if="currentPage==0"/></div>
            <div style="width:750px;"><source-manage-redeem v-if="currentPage==1"/></div>

        </div>
    </div>
</template>

<style scoped>
.main {
    background-color:#f2f3f5;
    /* height: 100%; */
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

.top-tab-box {
    height: 100px;
    background-color: #fff;
    padding: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.top-tab-item {
    height: 100px;
    background-color: #fff;
    width: 325px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.top-tab-text {
    height: 100px;
    width: 195px;
    font-size: 32px;
    background-color: #fff;

    text-align: center;
    line-height: 100px;
}
.top-tab-selected {
    border-bottom-width: 3px;
    border-bottom-color: #1E90FF;
    border-bottom-style: solid;
    color: #1E90FF;
}



</style>
<script>
import {
    WxcMinibar, WxcTabPage
} from 'weex-ui';
import Config from "./config"
import SourceManageAdd from "./source_manage_add"
import SourceManageRedeem from "./source_manage_redeem"
import {imgSrc,getStorage} from './utils/config'
    const animation = weex.requireModule('animation')
     const globalLan = require('./utils/language/global')
    const storage = weex.requireModule('storage');
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
export default {
    components: {
		WxcMinibar, WxcTabPage, SourceManageAdd, SourceManageRedeem
	},
    data() {
      return {
          tabTitles: Config.tabTitles,
          tabStyles: Config.tabTopStyles,
          isTypeShow: false,
          typeName: "公钥",
          currentPage:0,
          imgSrc: imgSrc,
          globalLan: globalLan,
		  zhLan: {},
      }
  },
  async mounted() {
		 	console.log("manage获取语言开始")
			let lan = await getStorage('lan')
			console.log("语言类型",lan)
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("source_manage", lan)
			console.log("语言包manage",JSON.stringify(this.zhLan))
		},
  methods: {
      goBack() {
          console.log("点击了返回按钮")
           navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
      },
      wxcTabPageCurrentTabSelected(e) {
          console.log(e)
          this.currentPage = e.page
      },
      changePage(e) {
          this.currentPage = e
      }
  }
};
</script>