<template>
<div class="main" ref="source">
    <div class="navigator">
        <image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
        <text style="font-size: 36px;; color: #1E90FF;" >{{zhLan.source_manage}}</text>
        <image  src="" style="height: 60px;width: 60px"></image>
	</div>
    <scroller :style="scrollerStyle" class="scroller">
        <refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
            <text class="indicator-text">{{refreshText}}</text>
            <loading-indicator class="indicator"></loading-indicator>
        </refresh>
        <div class="source-box">
            <div class="source-item-box">
                <div class="source-item-header">
                    <image :src="`${imgSrc}cpu`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
                    <text style="line-height:65px;font-size:36px">CPU</text>
                    <div class="source-item-header-statis">
                        <text class="source-item-header-statis-text"> {{cpuAvail}} s / {{cpuMax}} s</text>
                    </div>
                </div>
                <div class="source-item-middle">
                    <div class="source-item-middle-item">
                        <div>
                            <text class="source-item-middle-item-title">{{zhLan.mortgage_self}}</text>
                            <text class="source-item-middle-item-title">{{pledgeCPU.total}}</text>
                        </div>
                        <div>
                            <text  class="source-item-middle-item-main">{{zhLan.self}}{{pledgeCPU.bySelf}}</text>
                            <text  class="source-item-middle-item-main">{{zhLan.other}}{{pledgeCPU.byOther}}</text>                        
                        </div>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px; margin-left: 30px;" @click="goSourceManage('cpu', false)"></image>
                </div>
                <div class="source-item-foot">
                    <div class="source-item-middle-item">
                        <div>
                            <text class="source-item-middle-item-title">{{zhLan.mortgage_other}}</text>
                        </div>
                        <div>
                            <text  class="source-item-middle-item-main">{{pledgeCPU.forOther}}</text>                       
                        </div>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px; margin-left: 30px;" @click="goSourceManage('cpu', true)"></image>
                </div>
            </div>
        </div>
        <div class="source-box">
            <div class="source-item-box">
                <div class="source-item-header">
                    <image :src="`${imgSrc}net_source`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
                    <text style="line-height:65px;font-size:36px">NET</text>
                    <div class="source-item-header-statis">
                        <text class="source-item-header-statis-text"> {{netAvail}} MB / {{netMax}} MB</text>
                    </div>
                </div>
                <div class="source-item-middle">
                    <div class="source-item-middle-item">
                        <div>
                            <text class="source-item-middle-item-title">{{zhLan.mortgage_self}}</text>
                            <text class="source-item-middle-item-title">{{pledgeNET.total}}</text>
                        </div>
                        <div>
                            <text  class="source-item-middle-item-main">{{zhLan.self}}{{pledgeNET.bySelf}}</text>
                            <text  class="source-item-middle-item-main">{{zhLan.other}}{{pledgeNET.byOther}}</text>                        
                        </div>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px; margin-left: 30px;" @click="goSourceManage('net', false)"></image>
                </div>
                <div class="source-item-foot">
                    <div class="source-item-middle-item">
                        <div>
                            <text class="source-item-middle-item-title">{{zhLan.mortgage_other}}</text>
                        </div>
                        <div>
                            <text  class="source-item-middle-item-main">{{pledgeNET.forOther}}</text>                       
                        </div>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px; margin-left: 30px;" @click="goSourceManage('net', true)"></image>
                </div>
            </div>
        </div>
        <div class="source-box" >
            <div class="source-item-box1">
                <div class="source-item-header">
                    <image :src="`${imgSrc}ram`" mode="" style="height: 60px;width: 60px; margin-right: 20px;"></image>
                    <text style="line-height:65px;font-size:36px">RAM</text>
                    <div class="source-item-header-statis">
                        <text class="source-item-header-statis-text"> {{ramAvail}} KB / {{ramMax}} KB</text>
                    </div>
                </div>
                <div class="source-item-middle1">
                    <div class="source-item-middle-item">
                        <div>
                            <text class="source-item-middle-item-title">{{zhLan.used}}</text>
                            <text class="source-item-middle-item-title">{{ramUsage}} KB</text>
                        </div>
                        <div>
                            <text  class="source-item-middle-item-title">{{zhLan.left}}</text>
                            <text  class="source-item-middle-item-title">{{ramAvail}} KB</text>                        
                        </div>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 45px;width: 45px; margin-left: 30px;" @click="goRamManage"></image>
                </div>
            </div>
        </div>   
  </scroller>
</div>
  
</template>

<style scoped>
.main {
    background-color:#f2f3f5;
    /* height: 100%; */
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
    background-color: #ffffff;
    width: 750px;
    height: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
	padding: 0 20px;
    position: absolute;
    top: 0;
}

.source-box {
    /* width: 750px; */
    /* margin: 10px 0; */
    padding: 20px;
}
.source-item-box {
    height: 400px;
    background-color: #ffffff;
    border-radius: 10px;
	/* box-shadow:2px 2px 2px -2px gray; */
    /* align-items: center; */
}

.source-item-box1 {
    height: 300px;
    background-color: #ffffff;
    border-radius: 10px;
}
.choice-box-item-left {
    flex-direction: row;
    line-height: 100px;
}
.source-item-header {
    padding: 20px 40px;
    height: 100px;
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    align-items: center;
}
.source-item-header-statis {
    height: 60px;
    padding: 10px;
    width: 450px;
    border-radius: 20px;
    background-image: linear-gradient(to bottom right, #1E90FF, #87CEFA);
    margin-left: 40px;
}

.source-item-header-statis-text {
    font-size: 28px;;
    width:430px; 
    text-align:center; 
    height:40px;
    line-height:40px;
    color: #ffffff;
}
.source-item-middle {
    padding: 20px 40px;
    height: 200px;
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    align-items: center;
}
.source-item-middle1 {
    padding: 20px 40px;
    height: 200px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.source-item-middle-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 500px;
}
.source-item-middle-item-title {
    font-size: 32px;;
    /* font-weight: bold; */
    padding: 10px 0;
}

.source-item-middle-item-main {
    font-size: 28px;;
    padding: 10px 0;
    color: gray;
}
.source-item-foot {
    padding: 20px 40px;
    height: 100px;
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    align-items: center;
}

.scroller {
    top: 130px;
}

  .refresh {
    width: 750;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
  }
  .indicator-text {
    color: #888888;
    font-size: 28px;;
    text-align: center;
  }
  .indicator {
    margin-top: 16px;
    height: 60px;
    width: 60px;
    color: #00c16b;
  }

  

</style>
<script>
import { WxcMinibar, Utils } from 'weex-ui';
//import { getResourceBalance } from './utils/eos'
import { imgSrc, getStorage } from "./utils/config";


//new
import { getResourceBalance } from './utils/eos_v2'
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const navigator = weex.requireModule('navigator')
const utils = require('./appUtils')
const globalLan = require('./utils/language/global')
	const animation = weex.requireModule('animation')
export default {
  components: { WxcMinibar },
  data() {
      return {
          imgSrc: imgSrc,
          account:[],
          cpuAvail: "0",
          cpuMax: "0",
          netAvail: "0",
          netMax: "0",
          ramAvail: "0",
          ramUsage: "0",
          ramMax: "0",
          pledgeCPU:{
              bySelf: "0",
              byOther: "0",
              forOther: "0",
              total: "0"
          },
          pledgeNET:{
              bySelf: "0",
              byOther: "0", 
              forOther: "0",
              total: "0",
          },
          scrollerStyle: {},
          refreshing: false,
          refreshText: "下拉刷新",
          globalLan: globalLan,
		  zhLan: {},
          modalLan:{}
      }
  },
  async created() {
    const tabPageHeight = Utils.env.getPageHeight();
    this.scrollerH = (tabPageHeight+1000) +'px'
    this.scrollerStyle = {
        height:this.scrollerH
    }
    this.account = JSON.parse(await getStorage("Account"))
    console.log("获取当前账号",this.account)
    await this.getInfos()

    //     this.pledgeCPU.forOther = lendCPU + symbol
    // this.pledgeNET.forOther = lendNET + symbol
  },
      async mounted() {
			let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("source", lan)
			console.log("语言包",JSON.stringify(this.zhLan))
		},
  methods: {
    async getInfos() {
        let info = await getResourceBalance(this.account.account_name)
        console.log("info："+JSON.stringify(info))
        console.log(info)
        this.cpuAvail = Math.round(info.accountInfo.cpu_limit.available/10000)/100
        this.cpuMax = Math.round(info.accountInfo.cpu_limit.max/10000)/100
        this.netAvail = Math.round(info.accountInfo.net_limit.available*100/1024/1024)/100
        this.netMax = Math.round(info.accountInfo.net_limit.max*100/1024/1024)/100 
        this.ramAvail = Math.round((info.accountInfo.ram_quota - info.accountInfo.ram_usage) *100 /1024) / 100
        this.ramUsage = Math.round(info.accountInfo.ram_usage * 100 / 1024)  / 100 
        this.ramMax = Math.round(info.accountInfo.ram_quota * 100 / 1024)  / 100

        let cpu_weight = info.cpu.self_weight
        let cpu_total = info.cpu.total_weight
        let symbol = ""
        let selfCPU = 0
        let totalCPU = 0
        console.log(cpu_weight)
        if(cpu_weight) {
            symbol = cpu_weight.substring(cpu_weight.lastIndexOf(" "), cpu_weight.length)
            selfCPU = parseFloat(cpu_weight.substring(0, cpu_weight.lastIndexOf(" ")))
        }

        if(cpu_total) {
          totalCPU = parseFloat(cpu_total.substring(0, cpu_total.lastIndexOf(" ")))  
        }
        
        this.pledgeCPU.byOther = this.getFloat((totalCPU-selfCPU),4) + symbol
        this.pledgeCPU.bySelf = this.getFloat(selfCPU, 4) + symbol
        this.pledgeCPU.total = this.getFloat(totalCPU, 4) + symbol


        let net_weight = info.net.self_weight
        let net_total = info.net.total_weight

        let selfNET = 0
        let totalNET = 0
        if(net_weight) {
            symbol = net_weight.substring(net_weight.lastIndexOf(" "), net_weight.length)
            selfNET = parseFloat(net_weight.substring(0, net_weight.lastIndexOf(" ")))
        }
        if(net_total) {
            totalNET = parseFloat(net_total.substring(0, net_total.lastIndexOf(" ")))
        }

        this.pledgeNET.byOther = (Math.round(totalNET*10000)-Math.round(selfNET*10000))/10000 + symbol  
            this.pledgeNET.bySelf = selfNET + symbol
        this.pledgeNET.total = totalNET+ symbol

        let lendCPU = 0
        let lendNET = 0
        for (let index = 0; index < info.receiveAccounts.rows.length; index++) {
            let item = info.receiveAccounts.rows[index]
            if(item.to == this.account.account_name) {
                continue
            }
            
            let cpu_weight1 = parseFloat(item.cpu_weight.substring(0, item.cpu_weight.lastIndexOf(" ")))
            let net_weight1 = parseFloat(item.net_weight.substring(0, item.net_weight.lastIndexOf(" ")))
            lendCPU += cpu_weight1
            lendNET += net_weight1
        }

        console.log("EEEEEEEEEEEEE")
        this.pledgeCPU.forOther = Math.round(lendCPU*10000)/10000 + symbol
        this.pledgeNET.forOther = Math.round(lendNET*10000)/10000 + symbol
    },
    goBack() {
        // console.log("点击了返回按钮")
        const assetsSet = new BroadcastChannel('assets_refresh')
        assetsSet.postMessage('refresh')
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    wxcTabBarCurrentTabSelected(e) {
      const index = e.page;
    },
    async goSourceManage(val,to) {
        // this.$router.push({path:"/source_manage", query:{type: val, toOther: to}})
        let data = {type: val, toOther: to}
        await storage.setItem("source",  JSON.stringify(data))
        navigator.push({
            url: utils.getUrl('source_manage.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },
    goRamManage(val,to) {
        // this.$router.push({path:"/ram_manage"})
        navigator.push({
            url: utils.getUrl('ram_manage.js'),
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
    },


    async onrefresh (event) {
        // modal.toast({ message: 'Refreshing', duration: 1 })
        this.refreshing = true
        this.refreshText = "刷新中。。。"
        await this.getInfos()
        this.refreshing = false
        this.refreshText = "下拉刷新"
      },
      onpullingdown (event) {
        console.log("dy: " + event.dy)
        console.log("pullingDistance: " + event.pullingDistance)
        console.log("viewHeight: " + event.viewHeight)
        console.log("type: " + event.type)
      },
      getFloat(number, n) {
	n = n ? parseInt(n) : 0;
	if(n <= 0) {
		return Math.round(number);
	}
	number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
	number = Number(number).toFixed(n); //补足位数
	return number;
}
  }
};
</script>