<template>
<div ref="test1" class="main">

    <div class="search">
		<div class="search-box">
            <!-- <image :src="`${imgSrc}search`" style="width:28px;height:28px;"/> -->
            <input class="input"  type="text" v-model="url" :placeholder="zhLan.enter_toplay"   />
        </div>
        <text class="searchtextbtn" @click="goBack">{{zhLan.cancel}}</text>
    </div>

    <div v-if="this.url != '' " class="search-more">
        <div class="search-more-left">
            <text style="font-size:26px">{{zhLan.goto_dapp}}</text>
            <text style="font-size:26px;color: #1E90FF;" class="url-text" @click="goSearch">{{this.url}}</text>
        </div>
        <image :src="`${imgSrc}right`" mode="" style="height: 30px;width: 30px; " @click="goSearch"></image>
    </div>

    <scroller v-if="this.url == ''" :style="scrollerStyle">
        <div class="reco-box">
            <text class="title">{{zhLan.hot_search}}</text>
            <div class="reco-content">
                <div class="reco-item" v-for="(item,index) in hotDapps" :key="index" @click="goDapp(item)">
                    <text class="reco-item-name">{{lan == 'en-US'?item.enName:item.chName}}</text>
                </div>
            </div>
        </div>

        <div class="reco-box">
            <div style="flex-direction:row; justify-content:space-between;align-items:center; padding-bottom: 20px;">
                <text class="title">{{zhLan.histroy}}</text>
                <image :src="`${imgSrc}del`" mode="" style="height: 30px;width: 30px;  " @click="goDel"></image>
            </div>
            
            
            <div class="hot-item" v-for="(item,index) in histories" :key="index" @click="goDapp(item)">
                <image :src="`${imgSrc}bro`" mode="" style="height: 30px;width: 30px;margin-right:20px "></image>
                <div>
                    <text class="hot-item-name">{{lan == 'en-US'?item.enName:item.chName}}</text>
                    <text class="hot-item-url">{{item.url}}</text>
                </div>
                
            </div>
            
        </div>
    </scroller>
    

    <wxc-dialog :title="zhLan.ple_confirm"
            :content="zhLan.confirm_del_content"
            :show="showDialog"
            :single="false"
            :is-checked="false"
            :cancel-text="zhLan.cancel"
            :confirm-text="zhLan.confirm"
            main-btn-color="#ff0000"
            second-btn-color="#0000FF"
            @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
            @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
    </wxc-dialog>
</div>
  
</template>

<style scoped>
.main {
    background-color: #ffffff;
    opacity: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.search {
    background-color: #ffffff;
    flex-direction: row;
    padding:20px;
    align-items: center;
    justify-content: space-between;
}
.search-box {
    flex-direction: row;
    align-items: center;
    border-radius: 30px;
    flex-direction: row;
    align-items: center;
    width: 620px;
    height:70px;
    padding: 0 20px;
    background-color: #e1e3e6;  
}
.search-more {
    padding: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.search-more-left {
    
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
.input {
    font-size: 32px;
    height: 60px;
    background-color: #e1e3e6;  
    width: 600px;
}
.searchtextbtn {
    height: 80px;
    width: 100px;
    font-size: 32px;
    text-align: center;
    line-height: 80px;
}

.reco-box {
    width: 750px;
    margin: 20px 0 0 0;
    padding: 20px;
    line-height: 100px;
    background-color: #ffffff; 
}

.cat-box {
    width: 750px;
    margin: 20px 0 0 0;

    line-height: 100px;
    background-color: #ffffff; 
}
.title {
    font-size: 32px;
    color: gray;
    padding-bottom: 20px;
}

.title1 {
    font-size: 32px;
    color: gray;
}

.reco-content {
    flex-direction: row;
    flex-wrap: wrap;
    
   
}
.reco-item {
    
    background-color: #f2f3f5;
    padding: 15px 30px;
    margin: 10px ;
    /* flex-wrap: wrap; */
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.reco-item-name {
    font-size: 28px;
    flex-wrap: wrap;
    text-overflow:-o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    lines:2;
}

.url-text {
    flex-wrap: wrap;
    text-overflow:-o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    lines:1;
    width: 450px;
}

.hot-item {
    flex-direction: row;
    justify-items: flex-start;
    align-items: center;
        border-bottom-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
    padding: 20px 0;
}

.hot-item-name {
    font-size: 28px;
    flex-wrap: wrap;
    text-overflow:-o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(44, 43, 43);
    lines:1;
}

.hot-item-url {
    font-size: 24px;
    flex-wrap: wrap;
    
    
    text-overflow: ellipsis;
    color: rgb(44, 43, 43);
    width: 750px;
    lines:1;
}

</style>
<script>
const dom = weex.requireModule('dom');
import { WxcTabPage, WxcPanItem, Utils, BindEnv, WxcEpSlider, WxcDialog, } from 'weex-ui';
import { imgSrc, getStorage } from "./utils/config";
import { hotDapps, dappList } from "./utils/dapps"
import Config from './utils/dapps'
import { saveHistoryVisit } from "./utils/account"
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const storage = weex.requireModule('storage')
  const navigator = weex.requireModule('navigator')
  const utils = require('./appUtils')
  const globalLan = require('./utils/language/global')
export default {
 components: { WxcTabPage, WxcPanItem, WxcEpSlider, WxcDialog },
  	data() {
		return {
            imgSrc: imgSrc,
            hotDapps: hotDapps,
            tabList: dappList,
            tabPageHeight: 1334,
            url:'',
            listHeight:dappList[0].length*180 + 100,
            sliderId: 0,
            cardLength: 4,
            cardSize: {
                width: 750,
                height: 300,
                spacing: 0,
                scale: 1
            },
            currentIndex:0,
            autoPlay: false,
            showDialog: false,
            histories: [],
            scrollerStyle: {},
            zhLan: {},
            globalLan: globalLan,
            lan: "",
		}
    },
    beforeCreate() {
        this.tabList = dappList
        console.log(this.tabList)
        this.listHeight = this.tabList[0].length*160 + 100
    },
  async created() {
    this.tabPageHeight = Utils.env.getPageHeight();
    this.scrollerStyle = {
      height: (this.tabPageHeight) + "px",
      backgroundColor:'#ffffff'
    }

    let lan = await getStorage('lan')
    let zhLan = {}
    if(!lan) {
      lan = 'zh-CN'
    }
    this.lan = lan
    this.zhLan = await this.globalLan.lang("dapp_search", lan)
    this.histories = JSON.parse(await getStorage("history_visit"))
  },
  async mounted() {
    
    const lanSet = new BroadcastChannel('dapp_refresh')
    let that = this
    lanSet.onmessage = async function (event) {
        that.histories = JSON.parse(await getStorage("history_visit"))
    }
    
  },
  methods: {
    async goSearch() {
        let url = this.url
        if( url.substring(0,7) == 'http://' || url.substring(0,8) == 'https://') {
          
        } else {
            url = 'http://' + encodeURIComponent(url)
        }
        console.log(url)
        let form = {
            enName: "Unknown",
            chName: '未知',
            url: url
        }
        saveHistoryVisit(form)
        let name = ''
        if(this.lan == 'en-US') {
          name = "Dapp Browser"
        }else {
          name = "Dapp浏览器"
        }
        let data = {url: url, name:name}
        await storage.setItem("dapp",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        //this.$router.push({path:'/dapp',query:{url: this.url, name:"dapp浏览器"}})
    },
    async goDapp(item) {
        let form = {
            enName: item.enName,
            chName: item.chName,
            url: item.url
        }
        saveHistoryVisit(form)

        // let dappInfos = new BroadcastChannel('dappInfos')
        // dappInfos.postMessage({url:item.url, name:item.name})
        let name = ''
        if(this.lan == 'en-US') {
          name = item.enName
        }else {
          name = item.chName
        }
        let data = {url:item.url, name:name}
        await storage.setItem("dapp",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        // this.$router.push({path:'/dapp',query:{url:item.url, name:item.name}})
    },
    goDel() {
        this.showDialog = true
    },
    wxcDialogCancelBtnClicked() {
          this.showDialog = false
    },
    async wxcDialogConfirmBtnClicked() {
        storage.removeItem('history_visit')
        this.histories = []
        this.showDialog = false
    },

    goBack() {
        const lanSet = new BroadcastChannel('dapp_refresh')
        lanSet.postMessage('refresh')
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        
    },

  }
};
</script>