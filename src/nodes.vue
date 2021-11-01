<template>
    <div class="main" ref="nodes">
      	<!-- <div class="navigator">
            <wxc-minibar title="账号管理" background-color="#FFFFFF" text-color="#4ba363"
            :right-button="`${imgSrc}key`"
            @wxcMinibarLeftButtonClicked="goBack"
            @wxcMinibarRightButtonClicked="addPriKey"></wxc-minibar>
        </div> -->
        <div class="navigator">
				<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
				<text style="font-size: 36px; color: #3994da;" >{{chainName}}</text>
                <!-- <text style="font-size: 32px; color: #1E90FF;" >其它</text>	 -->
                <image src=""  style="height: 60px;width: 60px;"></image>
		</div>
        <scroller :style="scrollerStyle" class="scroller">
            <refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
                <text class="indicator-text">{{refreshText}}</text>
                <loading-indicator class="indicator"></loading-indicator>
            </refresh>
            <div style="padding:20px">
                <text style="font-size:28px; color:#808080">默认节点</text>
            </div>
            <div class="nodes-box">

                <div :class="['nodes-box-account', index == nodes.length-1 ? '':'nodes-box-border']" v-for="(item, index) in nodes" :key="index" @click="switchNode(item.Url)">
                    <div>
                        <text style="font-size:32px">{{item.Name}}</text>
                        <text style="font-size:24px;color:#808080">{{item.Url}}</text>
                    </div>
                    
                    <image :src="item.Url == chooseNode?`${imgSrc}yes_blue`:''"  style="height: 30px;width: 30px;" :key="index"></image>
                </div>
            </div>
        </scroller>
        
        <wxc-dialog :title="添加自定义节点"
                content=""
                :show="showDialog"
                :single="false"
                :is-checked="false"
                cancel-text="取消"
                :confirm-text="确认"
                main-btn-color="#ff0000"
                second-btn-color="#0000FF"
                @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
        </wxc-dialog>
       
    </div>
</template>

<style scoped>
.main {
    background-color:#f2f3f5;
    /* height: 100%; */
    opacity: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
/* .navigator {
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    background-color: #ffffff;
} */

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
    position: absolute;
    top: 0;
    /* z-index: 999; */
}

.scroller {
    top: 120px;
    background-color: #f6f6f6;
}

.nodes-box {
    width: 750px;
    padding: 0 20px;
    line-height: 100px;
    margin-bottom: 10px;
    background-color: #ffffff;
}

.nodes-box-account {
    background-color: #ffffff;
    height: 100px;
    
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

}

.nodes-box-border {
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
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
    font-size: 28px;
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
import {WxcMinibar, WxcPopup, WxcDialog, Utils} from 'weex-ui';
import {imgSrc, getStorage} from './utils/config'
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')
const animation = weex.requireModule('animation')
const navigator = weex.requireModule('navigator')
const utils = require('./appUtils')
const stream = weex.requireModule('stream')
import { api, requestV2, getCurrentVersion } from './utils/config_v2'
import { getCurrentChain } from './utils/chain'
export default {
    components: {
        WxcMinibar, WxcPopup, WxcDialog
    },
    
  data() {
      return {
          nodes:[],
          imgSrc: imgSrc,
          chooseAccount:{},
          showDialog: false,
          scrollerH: '',
          srollerStyle: {},
          refreshing: false,
          refreshText: "下拉刷新",
          chainName: '',
          chooseNode: '',
          chainInfos: {}
      }
  },
  beforeCreate() {

  },
  async created() {
    const tabPageHeight = weex.config.env.deviceHeight / weex.config.env.deviceWidth * 750
    console.log("获取到高度"+tabPageHeight)
    this.scrollerH = (tabPageHeight- 120) +'px'
    this.scrollerStyle = {
        height:this.scrollerH  
    }
    let data = JSON.parse(await getStorage("nodes"));

    this.chainName = data.chainName
    console.log("获取到chainName"+ this.chainName)
    this.chainInfos = JSON.parse(await getStorage('ChainManager'))
    let currentChainInfo = this.chainInfos[this.chainName]
    this.nodes = currentChainInfo.Nodes
    console.log("获取到节点长度："+this.nodes.length)
    console.log(currentChainInfo.CurrentNode)
    this.chooseNode = currentChainInfo.CurrentNode

    this.getNewNodes()
  },

  ready() {
      console.log("已准备")
  },
  computed: {
      
  },
  methods: {
      async getNewNodes() {
        console.log("开始获取节点版本号")
        let update = await getCurrentVersion("node")
        console.log("获取到节点版本号结果"+update)
        if(!update) {
            return
        }

        let requestUrl = api+'/v1/admin_api/token_chain/find?page=1&limit=10&symbol='+this.chainName
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
               console.log("获取到服务器提供的nodes")
               console.log(datas)
               let nodes = []
               if(datas.length == 0 || !datas) {
                   return
               }
               for (let i = 0; i < datas.length; i++) {
                   let data = datas[i];
                   let node = {}
                   node.Name = data.url_name
                   node.Url = data.url_node
                   nodes.push(node)
               }
               that.nodes = nodes
               console.log("内存中nodes数量："+that.chainInfos[that.chainName].Nodes.length)
               if(that.chainInfos[that.chainName].Nodes.length<=1 && nodes.length > 0) {
                   that.chooseNode = nodes[0].Url
                   that.chainInfos[that.chainName].CurrentNode = nodes[0].Url
               }
               that.chainInfos[that.chainName].Nodes = nodes
               storage.setItem("ChainManager",  JSON.stringify(that.chainInfos))

            }
        });
      },

      goBack() {
        navigator.pop({
            animated: "true"
        }, event => {
            console.log('callback: ', event)
        })
      },

      async switchNode(url) {
        let chainInfos = JSON.parse(await getStorage('ChainManager'))
        chainInfos[this.chainName].CurrentNode = url
        await storage.setItem("ChainManager",  JSON.stringify(chainInfos))
        this.chooseNode = url
      },
      wxcDialogCancelBtnClicked() {
          this.showDialog = false

      },

      async wxcDialogConfirmBtnClicked() {

          modal.toast({
              message: '账号删除成功',
              duration: 2
          })
          this.$router.go(-1)
          this.showDialog = false

          
          
      },
      deletePeivateKey() {
          this.showDialog = true
      },

      async onrefresh (event) {
        // modal.toast({ message: 'Refreshing', duration: 1 })
        this.refreshing = true
        this.refreshText = "刷新中。。。"
        // await this.updateAccounts()
        let requestUrl = api+'/v1/admin_api/token_chain/find?page=1&limit=10&symbol='+this.chainName
        let data = await requestV2('get',requestUrl,'')
        if(!data) {
            // modal.toast({
            //     message: '网络错误',
            //     duration: 3
            // });
                    console.log("网络错误")
        }else{
            console.log("获取到data")
            console.log(data.data)
               let datas = data.data.data
               let nodes = []
               for (let i = 0; i < datas.length; i++) {
                   let datav = datas[i];
                   let node = {}
                   node.Name = datav.url_name
                   node.Url = datav.url_node
                   nodes.push(node)
               }

               console.log(datas)
              
               let chainInfos = JSON.parse(await getStorage('ChainManager'))
               console.log("内存中nodes数量："+ chainInfos[this.chainName].Nodes.length)
               if(chainInfos[this.chainName].Nodes.length<=1 && nodes.length > 0) {
                   this.chooseNode = nodes[0].Url
                   chainInfos[this.chainName].CurrentNode = nodes[0].Url
               } 
               if(nodes.length > 0) {
                    this.nodes = nodes
                    chainInfos[this.chainName].Nodes = nodes
                    storage.setItem("ChainManager",  JSON.stringify(chainInfos))
               }

        }
        
        this.refreshing = false
        this.refreshText = "下拉刷新" 
      },
      onpullingdown (event) {
        // console.log("dy: " + event.dy)
        // console.log("pullingDistance: " + event.pullingDistance)
        // console.log("viewHeight: " + event.viewHeight)
        // console.log("type: " + event.type)
      }
  }
};
</script>