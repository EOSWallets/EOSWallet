<template>
    <div class="main" ref="ramM">
      	<!-- <div class="navigator">
            <wxc-minibar title="内存管理" background-color="#FFFFFF" text-color="#4ba363"
            @wxcMinibarLeftButtonClicked="goBack"></wxc-minibar>
        </div> -->
        <div class="navigator">
            <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
            <text style="font-size: 36px;; color: #1E90FF;" >{{zhLan.ram_manage}}</text>
            <image src="" style="height: 60px;width: 60px"></image>
        </div>
        <div class="top-tab-box">
            <div class="top-tab-item" @click="changePage(0)">
                <text :class="['top-tab-text', currentPage==0? 'top-tab-selected':'']">{{zhLan.buyin}}</text>
            </div>
            <div class="top-tab-item" @click="changePage(1)">
                <text :class="['top-tab-text', currentPage==1? 'top-tab-selected':'']">{{zhLan.soldout}}</text>
            </div>
        </div>
        <div>
            <div style="width:750px;"><ram-manage-buy v-if="currentPage==0"/></div>
            <div style="width:750px;"><ram-manage-sell v-if="currentPage==1"/></div>

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
    font-size: 32px;;
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
import RamManageBuy from "./ram_manage_buy"
import RamManageSell from "./ram_manage_sell"
import {imgSrc,getStorage} from './utils/config'
const animation = weex.requireModule('animation')
const navigator = weex.requireModule('navigator')
const utils = require('./appUtils')
const globalLan = require('./utils/language/global')
export default {
    components: {
		WxcMinibar, WxcTabPage,RamManageBuy, RamManageSell
	},
    data() {
      return {
          currentPage:0,
          imgSrc: imgSrc,
          globalLan: globalLan,
          zhLan: {},
		  modalLan:{}
      }
  },
  async created() {
    console.log("获取语言开始",lan)
			let lan = await getStorage('lan')
			console.log("语言类型",lan)
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
            }
            console.log("rammanagey语言",this.globalLan)

			this.zhLan = await this.globalLan.lang("ram_manage", lan)
			
			console.log("rammanage语言包",JSON.stringify(this.zhLan))
  },
      async mounted() {
		 	
		},
  methods: {
      goBack() {
        //   console.log("点击了返回按钮")
        //   this.$router.go(-1)
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