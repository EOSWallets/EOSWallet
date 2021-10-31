<template>
<div class="body" ref="alter">
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF;" >{{$t('zhLan.trans_detail.detail')}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
	<div class="main">
		<div class="main-content">
            <div style="align-items:center">
                <div  class="state-icon">
                    <image :src="`${imgSrc}success`" style="height: 100px;width: 100px"></image>
                    <text style="color:#1E90FF;font-size:26px">{{$t('zhLan.trans_detail.tran_success')}}</text>
                </div>              
            </div>

            <div class="content-body">
                <div class="content-body-top">
                    <div style="align-items:center">
                        <text class="amount">{{action.action_trace.act.data.from == account.account_name ? '- ' : '+ '}}{{action.action_trace.act.data.quantity}}</text> 
                    </div>
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.send')}}</text>
                        <text class="item">{{action.action_trace.act.data.from}}</text>
                    </div>
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.receive')}}</text>
                        <text class="item">{{action.action_trace.act.data.to}}</text>
                    </div>
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.remark')}}</text>
                        <text class="item">{{action.action_trace.act.data.memo}}</text>
                    </div>
                </div>
                <div class="content-body-foot">
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.tran_id')}}</text>
                        <text class="item">{{action.action_trace.trx_id}}</text>
                    </div>
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.block_height')}}</text>
                        <text class="item">{{action.block_num}}</text>
                    </div>
                    <div>
                        <text class="title">{{$t('zhLan.trans_detail.tran_time')}}</text>
                        <text class="item">{{action.block_time}}</text>
                    </div> 
                </div>
            </div>
           
        </div>
			
	</div>	

    <div class="footer">
        <text style="font-size:26px;padding-bottom:20px">{{$t('zhLan.trans_detail.go_query')}}</text>
                <div class="reco-content">
            <div class="reco-item" v-for="(item,index) in transBrowsers" :key="index" @click="goDapp(item)">
                <image :src="item.icon" class="reco-item-icon" />
                <text class="reco-item-name">{{item.name}}</text>
            </div>
        </div>
    </div>
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar} from 'weex-ui';
	const modal = weex.requireModule('modal')
    const animation = weex.requireModule('animation')
    const storage = weex.requireModule('storage')
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
    import { imgSrc, getStorage } from "./utils/config";
    import { transBrowser } from "./utils/dapps"
    import { saveHistoryVisit, saveMyDapps } from "./utils/account"
	export default {
		components: { WxcButton,WxcMinibar },
		data() {
			return {
				shows:[ false, false, false],
                passImgs:[imgSrc+"eye", imgSrc+"eye", imgSrc+"eye"],
                oldPassword: "",
				password:"",
				password2:"",
				psdTips:"",
				width: "100%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
                color: "#ffffff", 
                passImg: imgSrc+"eye",
				passType: "password",
				publicKey: "",
				imgSrc: imgSrc,
                isShowTips: false,
                transBrowsers: transBrowser,
                action:{},
                account: {}
			};
		},
		mounted() {
			var testEl = this.$refs.alter;
			animation.transition(testEl, {
				styles: {
					color: '#FF0000',
					opacity: 1
				},
				duration: 800, //ms
				timingFunction: 'ease',
				delay: 0 //ms
				}, function () {
			})
		},
		computed:{
			btnStyle () {
				const { width, height, backgroundColor, borderColor, borderRadius } = this;
				const customStyle = {};
				if (width) {
				  customStyle.width = width;
				}
				if (height) {
				  customStyle.height = height;
				  customStyle.lineHeight = height;
				}
				if (backgroundColor) {
				  customStyle.backgroundColor = backgroundColor;
				}
				if (borderColor) {
				  customStyle.borderColor = borderColor;
				  customStyle.borderWidth = '1px';
				  customStyle.borderStyle = 'solid';
				}
				if (borderRadius) {
				  customStyle.borderRadius = borderRadius;
				}
				return customStyle;
			},
			textStyle () {
				const { fontSize, color } = this;
				const customStyle = {};
				if (fontSize) {
					customStyle.fontSize = fontSize;
				}	
				if (color) {
					customStyle.color = color;
				}
				return {
					fontSize, color
				}
			},
			judgeIsDisabled() {
				if(!this.oldPassword) {
					return true
				}
				if(!this.password) {
					return true
				}
				if (!this.password2) {
					return true
				}
				if (this.password != this.password2) {
					return true
				}
				return false
            },
        },
        async beforeCreate() {
            this.account = JSON.parse(await getStorage('Account'))
            this.action = JSON.parse(await getStorage('action'))
            console.log("获取到action")
            console.log(this.action)
            // storage.removeItem('action')
        },
		created() {

		},
		methods:{
			goBack() {
                storage.removeItem('action')
				// this.$router.go(-1)
                navigator.pop({
                    animated: "true"
                }, event => {
                    console.log('callback: ', event)
                })
			},
            async goDapp(item) {
                let form = {
                    name: item.name,
                    url: item.url
                }
                let form1 = {
                    icon: item.icon,
                    name: item.name,
                    url: item.url
                }
                saveHistoryVisit(form)
                saveMyDapps(form1)
                // this.$router.push({path:'/dapp',query:{url:item.url+'/tx/'+this.action.action_trace.trx_id}})

                let data = {url:item.url+'/tx/'+this.action.action_trace.trx_id}
                await storage.setItem("dapp",  JSON.stringify(data))

                navigator.push({
                    url: utils.getUrl('dapp.js'),
                    animated: "true"
                }, event => {
                    console.log('callback: ', event)
                })
            },
		}
	}
</script>

<style scoped >
.alter {
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
	.main {
		align-items: center;
        justify-content: center;
        padding-top: 80px;
        position: relative;
	}
    .main-content {
        width: 700px;
        height: 900px;
        border-radius: 30px;
        background-color: #ffffff;
    }
    .state-icon {
        /* position: absolute; */
       
        align-items: center;
    }
    .content-body {
       
        padding:10px 60px;
    }

    .content-body-top {
        border-bottom-width: 1px;
	    border-bottom-color: #C0C0C0;
	    border-bottom-style: solid;
        padding-bottom: 20px;
    }
    .content-body-foot {
        margin-top: 40px;
    }
    .amount {
        font-size: 36px;
        font-weight: bold;
    }

    .title {
        color: #808080;
        font-size: 28px;
        
    }

    .item {
        font-size: 28px;
        width: 580px;
        padding: 10px 0 20px 0;
    }

	.footer {
        margin-top: 40px;
        align-items: center;
    }

.reco-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
   
}

.reco-item {
    width: 160px;
    height: 150px;
    margin: 10px 0px;
    justify-content: center;
    align-items: center;
}

.reco-item-icon {
    width:80px;
    height:80px;
    position: absolute;
    top: 0;
    border-radius: 25px;
    
}
.reco-item-name {
    position: absolute;
    top: 85px;
    width: 160px;
    text-align: center;
    font-size: 22px;
    flex-wrap: wrap;
    text-overflow:-o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    lines:2;
}

</style>
