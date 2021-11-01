<template>
<div ref="test1" class="main">
    <div class="search">
      <div class="search-box" @click="goSearch1">
        <!-- <image :src="`${imgSrc}search`" style="width:40px;height:40px;"/> -->
        <text class="input">{{zhLan.enter_toplay}}</text>
              <!-- <input class="input"  type="text" v-model="url" placeholder="输入DApp链接进入玩耍" @return="goSearch" return-key-type="search"  /> -->
      </div>
        <image :src="`${imgSrc}sao`" style="width:50px;height:50px;" @click="goScan"/>
    </div>
    <scroller  :style="scrollerStyle" >
      <div style="align-items:center; margin-top:10px">
        <slider class="slider" auto-play="true" interval="3000" @change="onchange" style="background-color:#ffffff">
          <div class="frame" v-for="img in imgList" :key="img">
            <image class="image"  :src="img"></image>
          </div>
          <indicator class="indicator"></indicator>
        </slider>
      </div>


      <div  style="margin-top:40px">
          <div style="justify-content:center; align-items:center;" >
            <div style="flex-direction:row; justify-content:space-between; align-items:center;width:710px">
              <text class="title">{{zhLan.my_dapps}}</text>
              <div @click="goMyDapps" style="flex-direction:row;padding-bottom: 15px; align-items:center">
                <text style="font-size:28px;color:gray">{{zhLan.more}}</text>
                <image :src="`${imgSrc}right_gray`" style="width:28px;height:28px;" />
              </div>
            </div>
          </div>

          <div class="reco-content">
              <div class="reco-item" v-for="(item,index) in myDapps" :key="index" @click="goDapp(item)">
                  <image :src="item.img_src" class="reco-item-icon" :key="index"/>
                  <text class="reco-item-name">{{lan=='en-US'?item.dapp_name_eng:item.dapp_name_chn}}</text>
              </div>
          </div>
      </div>

      <div class="reco-box" >
        <div style="justify-content:center; align-items:center;">
          <text class="title" style="width:710px">{{zhLan.recommend_dapp}}</text>
        </div>
          
          <div class="reco-content">
              <div class="reco-item" v-for="(item,index) in recomDapps" :key="index" @click="goDapp(item)">
                  <image :src="item.img_src" class="reco-item-icon"/>
                  <text class="reco-item-name">{{lan=='en-US'?item.dapp_name_eng:item.dapp_name_chn}}</text>
              </div>
          </div>
      </div>

      <div class="cat-box">
          <wxc-tab-page
          :tab-titles="tabTitles"
          :tab-styles="tabStyles"
          title-type="icon"
          tab-page-height="1160"
          wrapBgColor="#f6f6f6"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
              <div v-for="(v,index) in tabList"
              :key="index"
              class="item-container">
                <div class="item-con"  v-if="v.length>0">
                  <div v-for="(item,key) in v.slice(0,6)" class="cell" :key="key">
                      <div @click="wxcPanItemPan(item)">
                          <div class="content">
                              <image :src="item.img_src" class="content-icon"/>
                              <div  class="content-right">
                                  <text class="content-name">{{lan=='en-US'?item.dapp_name_eng:item.dapp_name_chn}}</text>
                                  <text class="content-desc">{{lan=='en-US'?item.infos_eng:item.infos_chn}}</text>
                              </div> 
                          </div>
                      </div>
                  </div>
                  <div class="more-box" @click="goMoreDapps(index)">
                    <text class="more-text">{{zhLan.see_more}}</text>
                    <image :src="`${imgSrc}right_blue`" style="width:28px;height:28px; margin-left:10px" />
                  </div>
                </div>
              </div>
          </wxc-tab-page>
      </div>

  </scroller>
</div>
  
</template>

<style scoped>

.image{
        width: 710px;
        height: 250px;
        border-radius: 20px;
    }
    .slider{
        width: 710px;
        height: 250px;
        border-radius: 30px;
            align-items: center;
    justify-content: center;
    }
    .frame{
        width: 710px;
        height: 250px;
        position: relative;
        border-radius: 20px;
    }
    .indicator{
        position: absolute;
        bottom: 20px;
    }

.main {
  opacity: 1;
  background-color: #f6f6f6;
}

.search {
    /* background-color: #d4d1d1; */
    flex-direction: row;
    padding:20px;
    align-items: center;
    justify-content: space-between;
}
.search-box {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border: 30px;
    flex-direction: row;
    align-items: center;
    /* background-color: #ffffff; */
    height:70px;
    width: 650px;
    padding: 0 20px;
    background-color: #e1e3e6;
    border-radius: 30px;      
}
.input {
    /* width: 500px; */
    font-size: 32px;
    color: gray;
}
.searchtextbtn {
    height: 82px;
    width: 150px;
    background-color: #1E90FF;
    /* border-radius: 10px; */
    color: #ffffff;
    text-align: center;
    line-height: 80px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-width: 1px;
    border-color:  #1E90FF;
}

.reco-box {
    width: 750px;
    margin: 10px 0 0 0;
    /* background-color: #ffffff;  */
}

.cat-box {
    width: 750px;
    margin: 10px 0 0 0;

    /* background-color: #ffffff;  */
}
.title {
    font-size: 32px;
    padding-bottom: 15px;
    font-family: "Microsoft YaHei","Droid Sans Fallback";
}
.reco-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
   
}

.reco-item {
    width: 150px;
    height: 165px;
    
    justify-content: center;
    align-items: center;
}

.reco-item-icon {
    width:100px;
    height:100px;
    position: absolute;
    top: 0;
    border-radius: 25px;
    border-width: 1px;
    border-color: #C0C0C0;
    border-style: solid;
    
}
.reco-item-name {
    position: absolute;
    top: 110px;
    width: 120px;
    text-align: center;
    font-size: 22px;
    flex-wrap: wrap;
    text-overflow:-o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    lines:2;
}



  .item-container {
    width: 750px;
    padding-top: 30px;
    align-items: center;
  }

  .item-con {
    width: 700px;
    background-color: #ffffff;
     border-radius: 30px;
     padding: 20px 0;
  }

  .border-cell {
    width: 700px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
  }

  .cell {
    /* background-color: #ffffff; */
  }

  .content{
    width:700px;
    flex-direction: row;
    align-items: center;
    height: 140px;
    padding: 40px 20px;

  }
  .content-icon{
    width: 100px;
    height: 100px;
    border-radius: 20px;
    margin-right: 20px;
    border-width: 1px;
    border-color: #C0C0C0;
    border-style: solid;
  }
  .content-right {
    justify-content: center;
    border-bottom-width: 1px;
    border-color: #C0C0C0;
    border-style: solid;
    height: 120px;
    width: 540px;
    padding-bottom: 10px;
      
  }
  .content-name {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .content-desc {
    font-size: 24px;
    color: gray;
    lines:1;
    text-overflow: ellipsis;
  }


  .more-box {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding:20px 0;
  }

  .more-text {
    font-size: 28px;
    color: #6495ed;
  }


</style>
<script>
const dom = weex.requireModule('dom');
import { WxcTabPage, WxcPanItem, Utils, BindEnv, WxcEpSlider } from 'weex-ui';
import { imgSrc, getStorage } from "./utils/config";
import { api, requestV2 } from './utils/config_v2'
import { recomDapps, dappList } from "./utils/dapps"
import Config from './utils/dapps'
  const animation = weex.requireModule('animation')
  const modal = weex.requireModule('modal')
  const scan = weex.requireModule('zfjg-scan')
  import { saveHistoryVisit, saveMyDapps } from "./utils/account"
    const navigator = weex.requireModule('navigator')
    const storage = weex.requireModule('storage')
  const utils = require('./appUtils')
    const globalLan = require('./utils/language/global')
    const stream = weex.requireModule('stream')
export default {
    components: { WxcTabPage, WxcPanItem, WxcEpSlider },
    props:{
      heights: {
        type: Number,
        default: 0
      },
    },
  	data() {
      return {
        imgSrc: imgSrc,
        recomDapps: [],
        tabTitles: {},
        tabStyles: Config.tabStyles,
        tabList: [],
        tabPageHeight: 1334,
        url:'',
        listHeight:0,
        myDapps:[],
        scrollerStyle: {},

        currentIndex:0,
        autoPlay: false,
        //顶部轮播图地址数组
        imgList: [
          "https://dappimg.com/media/image/banner/eea78af2c9f449e5bb1f126bc9ae287c.png",
          "https://dappimg.com/media/image/banner/5959422485504eaebeaa1fd1f6cbd534.png",
          "https://dappimg.com/media/image/article/b69586ac-9e87-4b77-9e4d-a35cfd7a0a8d.jpg"
        ],
        isMy: false,
        isRec: false,
        isCat: false,
        zhLan: {},
        lan: '',
        globalLan: globalLan,
        allDapps: {},
        chainName: ""
      }
    },
    async beforeCreate() {
        let chainManager = JSON.parse(await getStorage('ChainManager'))
        let chainName = chainManager.CurrentChain
        this.chainName = chainName
        let reco = await getStorage(chainName+"_RecoDapps")
        console.log("获取到推荐本地")
        console.log(reco)
        if(reco) {
          this.recomDapps = JSON.parse(reco)
        }
        let my = await getStorage(chainName+"_MyDapps")
        if(my) {
          let myDapps = JSON.parse(my)
          this.myDapps = myDapps.slice(0,5)
        }
        //模拟数据
        this.myDapps = [
          {
            dapp_name_eng:"bloks",
            dapp_name_chn:"bloks",
            url:"https://bloks.io/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1BuX.png"
          },
          {
            dapp_name_eng:"PIZZA",
            dapp_name_chn:"PIZZA",
            url:"https://pizza.finance/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1F16.jpg"
          }
        ]
        this.recomDapps = [
          {
            dapp_name_eng:"bloks",
            dapp_name_chn:"bloks",
            url:"https://bloks.io/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1BuX.png"
          },
          {
            dapp_name_eng:"Oranix",
            dapp_name_chn:"Oranix",
            url:"https://www.ogx.network/dapp",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1ZrP.png"
          },
          {
            dapp_name_eng:"Defibox",
            dapp_name_chn:"Defibox",
            url:"http://dapp.defibox.io",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1ROM.jpg"
          },
          {
            dapp_name_eng:"PIZZA",
            dapp_name_chn:"PIZZA",
            url:"https://pizza.finance/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1F16.jpg"
          },
          {
            dapp_name_eng:"Newdex",
            dapp_name_chn:"Newdex",
            url:"https://newdex.io/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1Pln.jpg"
          },
          {
            dapp_name_eng:"WhaleEx",
            dapp_name_chn:"WhaleEx",
            url:"https://www.whaleex.com/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1a6R.jpg"
          },
          {
            dapp_name_eng:"DFS Network",
            dapp_name_chn:"DFS Network",
            url:"https://defis.network/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV13Rz.png"
          },
          {
            dapp_name_eng:"SportBet",
            dapp_name_chn:"SportBet",
            url:"https://sportbet.one/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1XLA.jpg"
          },
          {
            dapp_name_eng:"Blockchain Cuties",
            dapp_name_chn:"Blockchain Cuties",
            url:"https://blockchaincuties.com/",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1eQ5.jpg"
          },
          {
            dapp_name_eng:"BetHash",
            dapp_name_chn:"BetHash",
            url:"http://bethash.net/?ref=eosbetadmin1",
            img_src: "https://www.helloimg.com/images/2021/11/01/CV1EJm.jpg"
          }
        ]
        

    },
  async created() {
    // let len = this.tabList[0].length > 6 ? 6 : this.tabList[0].length
    this.listHeight = 6*160 + 100
    this.scrollerStyle = {
      height: (this.heights-110) + "px",
      backgroundColor:'#f6f6f6'
    }
    let lan = await getStorage('lan')
    let zhLan = {}
    if(!lan) {
      lan = 'zh-CN'
    }
    this.lan = lan
    this.zhLan = await this.globalLan.lang("dapp_index", lan)
    let dappsData = await getStorage(this.chainName+"_allDapps")
    if(dappsData) {
      this.allDapps = JSON.parse(dappsData)
    }
    if(lan == "en-US") {
      this.tabTitles = this.allDapps.en_titles
    } else {
      console.log("是中文")
      console.log(this.allDapps)
      console.log(this.allDapps.zh_titles)
      this.tabTitles = this.allDapps.zh_titles
    }
    this.tabList = this.allDapps.apps


    this.getRecoDapps()
    this.getAllDapps()
  },
  async mounted() {
    this.autoPlay = true
    const lanSet = new BroadcastChannel('refresh')
    let that = this
    lanSet.onmessage = async function (event) {
      console.log("获取到返回信息")
      let lan = await getStorage('lan')
      let zhLan = {}
      if(!lan) {
        lan = 'zh-CN'
      }
      that.lan = lan
      if(lan == "en-US") {
          that.tabTitles = that.allDapps.en_titles
        } else {
          that.tabTitles = that.allDapps.zh_titles
        }
      that.zhLan = await that.globalLan.lang("dapp_index", lan)
    }


    const chainSet = new BroadcastChannel('switchChain')
    chainSet.onmessage = async function (event) {
      console.log("获取到chainSet返回信息")
    }
    const dappSet = new BroadcastChannel('dapp_refresh')
    dappSet.onmessage = async function (event) {
      console.log("获取到返回信息")
      let myDapps = JSON.parse(await getStorage(that.chainName+"_MyDapps"))
      if(myDapps.length <= 5) {
        that.myDapps = myDapps
      }else {
        that.myDapps = myDapps.slice(0,5)
      }
      
    }

    
  },
  methods: {
    onchange (event) {
        console.log('changed:', event.index)
    },
    goScan() {
      let that = this
      scan.scanCode(res=> {
        let data = res.data
        
        if( data.substring(0,7) == 'http://' || data.substring(0,8) == 'https://') {
          console.log("对的")
        }else {
          data = 'http://' + encodeURIComponent(data)
        }
        
        let form = {
            enName: "Unknown",
            chName: '未知',
            url: data
        }
        saveHistoryVisit(form)
        let name = ""
        if(that.lan == "en-us") {
          name = "Dapp Browser"
        } else {
          name = 'Dapp浏览器'
        }
        let datas = {url: data, name:name}
        storage.setItem("dapp",  JSON.stringify(datas))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        //this.$router.push({path:'/dapp',query:{url: data}})
      })
    },
    goSearch1() {
      navigator.push({
          url: utils.getUrl('dapp_search.js'),
          animated: "true"
        }, event => {
          console.log('callback: ', event)
      })
        // this.$router.push({path:'/dapp_search'})
    },
    async goDapp(item) {
        let form = {
            enName: item.dapp_name_eng,
            chName: item.dapp_name_chn,
            url: item.url
        }
        let form1 = {
          img_src: item.img_src,
          dapp_name_chn: item.dapp_name_chn,
          dapp_name_eng: item.dapp_name_eng,
          url: item.url
        }

        let myDapps = await getStorage(this.chainName+"_MyDapps")
        if(!myDapps) {
          this.myDapps = [form1]
        }else {
          let array = JSON.parse(myDapps)
          let flag = false
          for (let index = 0; index < array.length; index++) {
              let element = array[index];
              if(form1.url == element.url){
                  flag = true
                  break
              }
          }

          if(!flag) {
              this.myDapps = [form1].concat(this.myDapps.slice(0,4))
          }
        }

        saveHistoryVisit(form)
        saveMyDapps(form1,this.chainName)

        let name = ''
        if(this.lan == 'en-US') {
          name = item.dapp_name_eng
        }else {
          name = item.dapp_name_chn
        }
        let data = {url: item.url, name:name}
        await storage.setItem("dapp",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
        //this.$router.push({path:'/dapp',query:{url:item.url}})
    },
    wxcTabPageCurrentTabSelected (e) {
        const self = this;
        const index = e.page;
        
        console.log("获取到page了："+e.page)
        this.listHeight = this.tabList[index].length*180 + 100
    },
    async wxcPanItemPan (item) {
        let form = {
            enName: item.dapp_name_eng,
            chName: item.dapp_name_chn,
            url: item.url
        }

        let form1 = {
          img_src: item.img_src,
          dapp_name_chn: item.dapp_name_chn,
          dapp_name_eng: item.dapp_name_eng,
          url: item.url
        }
        
        //

        let myDapps = await getStorage(this.chainName+"_MyDapps")
        if(!myDapps) {
          this.myDapps = [form1]
        }else {
          let array = JSON.parse(myDapps)
          let flag = false
          for (let index = 0; index < array.length; index++) {
              let element = array[index];
              if(form1.url == element.url){
                  flag = true
                  break
              }
          }

          if(!flag) {
              this.myDapps = [form1].concat(this.myDapps.slice(0,4))
          }
        }


        saveHistoryVisit(form)
        saveMyDapps(form1,this.chainName)
        let name = ''
        if(this.lan == 'en-US') {
          name = item.dapp_name_eng
        }else {
          name = item.dapp_name_chn
        }
        let data = {url: item.url, name:name}
        await storage.setItem("dapp",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('dapp.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    async goMyDapps() {
      let data = {type:'my'}
      await storage.setItem("dappList",  JSON.stringify(data))
      navigator.push({
          url: utils.getUrl('dapps_list.js'),
          animated: "true"
        }, event => {
          console.log('callback: ', event)
      })
      // this.$router.push({path:'dapps_list',query:{type:'my'}})
      // this.$router.push('dapps_list')
    },
    async goMoreDapps(index) {
      let title = this.tabTitles[index].title
      let data = {
        type:'dapps', title:title, apps:this.tabList[index]
      }
      await storage.setItem("dappList",  JSON.stringify(data))
      navigator.push({
          url: utils.getUrl('dapps_list.js'),
          animated: "true"
        }, event => {
          console.log('callback: ', event)
      })
      //this.$router.push({path:'dapps_list',query:{type:'dapps', title:title, num: index}})
    },
    async getRecoDapps() {
      console.log("开始获取推荐版本号")
      let update = await this.getCurrentVersion("recommend")
      console.log("获取到更新版本号结果"+update)
      if(!update) {
        return
      }
        let chainManager = JSON.parse(await getStorage('ChainManager'))
        let chainName = chainManager.CurrentChain
        let requestUrl = api+'/v1/admin_api/wallet/get?state=1&dappType='+chainName
        let that = this
        stream.fetch({
            method: 'GET',
            url: requestUrl,
            type:'json'
        }, function(ret) {
            if(!ret.ok){
            // modal.toast({
            //     message: '网络错误',
            //     duration: 3
            // });
            
                    console.log("网络错误")
            }else{
               let datas = ret.data.data
               console.log("获取到推荐dapps")
               console.log(datas)
               that.recomDapps = datas
               storage.setItem(chainName+"_RecoDapps",  JSON.stringify(datas))

            }
        });
      },
      async getAllDapps() {
      console.log("开始获取全部版本号")
      let update = await this.getCurrentVersion("all")
      console.log("获取到全部版本号结果"+update)
      if(!update) {
        return
      }
        console.log("开始获取全部")
        let chainManager = JSON.parse(await getStorage('ChainManager'))
        let chainName = chainManager.CurrentChain
        let requestUrl = api+'/v1/admin_api/wallet/find_recommend_wallet?publicChain'+chainName
        let that = this
        stream.fetch({
            method: 'GET',
            url: requestUrl,
            type:'json'
        }, function(ret) {
            if(!ret.ok){
            // modal.toast({
            //     message: '网络错误',
            //     duration: 3
            // });
                    console.log("网络错误")
            }else{
               let datas = ret.data.data
               console.log("获取到Dapp列表1")
               console.log(datas)
               that.tabList = datas.apps
               if(that.lan == 'en-US') {
                  console.log("英文的")
                  console.log(datas.en_titles)
                  that.tabTitles = datas.en_titles
               }else {
                 console.log('中文的')
                 console.log(datas.zh_titles)
                 that.tabTitles = datas.zh_titles
               }
               
              storage.setItem(chainName+"_allDapps",  JSON.stringify(datas))
            }
        });
      },

      async getCurrentVersion(type) {
        let version = await getStorage(type+'_version')
        let url = api+ "/v1/admin_api/version/get_version?type="+type
        let res = await requestV2('get', url, {})
        if(!res) {
          return true
        }

        let currVersion = res.data.data
        console.log("获取到当前版本号")
        console.log(res)
        storage.setItem(type+'_version', currVersion)
        if(!version || parseInt(version) != currVersion) {
          console.log("不需要更新")
          return true
        }

        return false
      }

  }
};
</script>