<template>
  <div class="main" ref="test">
  <div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF" >{{zhLan.language_set}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
    <div class="choice-box" @click="setLan('zh-CN')">
        <div class="choice-box-item-left">
            <text style="line-height:65px;font-size:32px">简体中文</text>
        </div>
        <image :src="`${imgSrc}success`" v-if="lan == 'zh-CN'" mode="" style="height: 45px;width: 45px;"></image>
    </div>
	<div class="choice-box" @click="setLan('en-US')">
	    <div class="choice-box-item-left">
	        <text style="line-height:65px;font-size:32px">English</text>
	    </div>
		<div style="flex-direction: row;">
			<image :src="`${imgSrc}success`" v-if="lan == 'en-US'" mode="" style="height: 45px;width: 45px;"></image>
		</div>
	    
	</div>
  </div>
</template>

<style scoped>
.main {

opacity:1;

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
  import {setLan} from './utils/language/language'
  import { imgSrc, getStorage } from "./utils/config";
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const globalLan = require('./utils/language/global')
  const utils = require('./appUtils')
  const navigator = weex.requireModule('navigator')
export default {
  	data() {
			return {
        imgSrc: imgSrc,
        lan: '',
        zhLan: {},
        globalLan: globalLan
			}
		},
  async created() {
      let lan = await getStorage('lan')
      console.log("获取到lan了啊："+lan)
      if(!lan) {
        lan = 'zh-CN'
      }
      this.lan = lan
    
      this.zhLan = await this.globalLan.lang("language_set", lan)
  },
  async mounted() {

  },
  methods: {
	  goBack() {
	    navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
	  },
	  async setLan(lan){
        await setLan(lan)
        const lanSet = new BroadcastChannel('refresh')
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