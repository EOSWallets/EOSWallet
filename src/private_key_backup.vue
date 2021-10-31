<template>
<div class="body" ref="priKeyBu">
    <!-- <div class="navigator">
        <wxc-minibar title="私钥备份" background-color="#FFFFFF" text-color="#4ba363"
            right-button="`${imgSrc}key`"
            @wxcMinibarLeftButtonClicked="goBack"
            @wxcMinibarRightButtonClicked="openPop"></wxc-minibar>
    </div> -->
    <div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF;" >{{zhLan.backup}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
		<!-- <image :src="step ==3? '':`${imgSrc}key`" style="height: 60px;width: 60px" @click="openPop"></image> -->
	</div>
    <div class="open-key-box" v-if="step!=3">
        <text class="open-key" @click="copy"  id="open-key">{{publicKeyFormatter(publicKey)}}</text>
    </div>
    <div v-if="step==1">
        <div class="main">
            <div>
                <text class="note">{{zhLan.enter_password}}</text>
            </div>
            <div>
                <div><input type="password" v-model="password" :placeholder="`${tran_sign.this_password}`" class="password" @keyboard="popKeyBoard"></div>
            </div>
        </div>
        <div style="justify-content:center;align-items:center">
            <div class="btn-box">
                <wxc-button size="big" :text="`${zhLan.confirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureInput" :disabled="judgeIsDisabled"></wxc-button>
            </div>
        </div>
        <!-- <div class="btn-box">
            <wxc-button size="big" text="确定"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureInput" :disabled="judgeIsDisabled"></wxc-button>
        </div> -->
    </div>

    <div v-if="step==2">
        <div class="main-two">
            <div>
                <text class="note">{{zhLan.important_tips}}</text>
            </div>
            <div>
                <text class="tips">{{zhLan.important_tips1}}</text>
                <text class="tips">{{zhLan.important_tips2}}</text>
                <text class="tips">{{zhLan.important_tips3}}</text>
                <text class="tips">{{zhLan.important_tips4}}</text>
            </div>
        </div>
        <div style="justify-content:center;align-items:center">
            <div class="btn-box">
                <wxc-button size="big" :text="`${zhLan.iknow}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="ensureClick"></wxc-button>
            </div>
        </div>

    </div>

    <div v-if="step==3">
        <div class="main-three">
            <div class="main-three-it">
                <div style="border-bottom-width: 1px;border-bottom-color: #C0C0C0;border-bottom-style: solid; height:200px;padding:10px 0">
                    <div class="main-three-item">
                        <text class="main-three-item-title">{{zhLan.pubkey}}</text>
                        <text class="main-three-item-content">{{publicKey}}</text>
                    </div>
                    <div class="copy-box">
                        <div class="copy-box-item" @click="copyThree(1)">
                            <text class="copy-box-text">{{zhLan.copy}}</text>
                        <image :src="`${imgSrc}copy`" mode="" style="height: 28px;width: 28px; margin-left: 10px;"></image>
                        </div>
                        
                    </div>
                    
                </div>
                <div style="height:200px;padding:10px 0 10px 0">
                    <div class="main-three-item">
                        <text class="main-three-item-title">{{zhLan.prikey}}</text>
                        <text class="main-three-item-content">{{privateKey}}</text>
                    </div>
                    <div class="copy-box">
                         <div class="copy-box-item" @click="copyThree(2)">
                            <text class="copy-box-text">{{zhLan.copy}}</text>
                            <image :src="`${imgSrc}copy`" mode="" style="height: 28px;width: 28px; margin-left: 10px;"></image>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

    <wxc-popup 
        :show="isBottomShow"
        @wxcPopupOverlayClicked="closePop"
        pos="bottom"
        popup-color="rgb(255,255,255)"
        height="600">
        <div>
            <div class="pop-header">
                <text class="text">{{zhLan.choose_pubkey}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closePop"></image>
            </div>
            
            <div class="pop-middle">
                <scroller class="scroller">
                    <div class="pop-middle-item" @click="setpublicKey(account.PublicKey)" v-for="(account, index) in accounts" :key="index">
                        <div>
                            <text class="pop-middle-item-text">{{publicKeyFormatter(account.PublicKey)}}</text>
                        </div>
                    </div>
                </scroller>
            </div>
        </div>
    </wxc-popup>	
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar, WxcPopup,Utils} from 'weex-ui';
    const clipboard = weex.requireModule('clipboard')
    const modal = weex.requireModule('modal');
    const storage = weex.requireModule('storage');
    import {getPrivateKey} from "./utils/account_v2"
    import { checkPassword} from "./utils/auth_v2"
    import accountsVue from './accounts.vue';
    import { imgSrc, getStorage } from "./utils/config_v2";
    const animation = weex.requireModule('animation')
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	
	export default {
		components: { WxcButton,WxcMinibar, WxcPopup },
		data() {
			return {
                imgSrc: imgSrc,
				password:"",
                privateKey:"",
				width: "80%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
                color: "#ffffff", 
                isBottomShow: false,
                step: 1,
                publicKey: "",
                accounts:[],
                keyboardShow: false,
                keyboardH: 0,
                globalLan:globalLan,
                zhLan:{},
                tran_sign:{},
                modal:{},
                chainName:""
                // bodyStyle: {},
			};
        },
        async created() {
            
    		//语言包
    		let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		}

			this.zhLan = await this.globalLan.lang("private_key_backup", lan)
			this.tran_sign = await this.globalLan.lang("tran_sign", lan)
			this.modal = await this.globalLan.lang("modal", lan)
            
			let param = JSON.parse(await getStorage("private_key_backup"))
            this.publicKey = param.publicKey;
            this.chainName = param.chainName;

            
            this.getAccounts()
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
				if(!this.password) {
					return true
				}
				return false
			},
		},
		watch: {

        },
    mounted() {
        var testEl = this.$refs.priKeyBu;
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
		methods:{
            popKeyBoard(e) {
                console.log("弹出输入框")
                console.log(e)
                this.keyboardShow = e.isShow
                this.keyboardH = e.keyboardSize
            },
            getAccounts() {
                storage.getItem("AccountManager", res =>{
                    this.accounts = JSON.parse(res.data)
                    console.log("获取到账号列表" + JSON.stringify(this.accounts))
                    console.log(this.accounts.length)
                })
            },
            copy() {
                clipboard.setString(this.publicKey)
                modal.toast({
                    message: this.modal.copy_success,
                    duration: 2
                })
            },
            publicKeyFormatter(publicKey) {
                return publicKey? publicKey.substring(0,16) + "..." + publicKey.substring(publicKey.length-17,publicKey.length): ""
            },
            goBack() {
                navigator.pop({
                    animated: "true"
                }, event => {
                    console.log('callback: ', event)
                })
            },
            openPop() {
                if(this.step == 3) {
                    return
                }
                this.isBottomShow = true
            },
            closePop () {
                this.isBottomShow = false;
            },
            setpublicKey(item) {
                this.publicKey = item
                
                this.password = ""
                this.isBottomShow = false;
                this.step = 1
                // this.$router.go(0)
                // this.$forceUpdate()
                
            },
			async ensureInput(e) {
				const { type, disabled } = e;
				if(disabled) {
					return
                }
                let validPwd = await checkPassword(this.publicKey,this.chainName,this.password)
                
                if(!validPwd){
                    modal.toast({
                        message: this.modal.password_notmatch,
                        duration: 2
                    })
                    return
                }

                this.step = 2
            },
            async ensureClick() {
                this.privateKey = await getPrivateKey(this.password, this.publicKey,this.chainName)
                this.step = 3
            },
            copyThree(e) {
                if(e == 1) {
                    clipboard.setString(this.publicKey)
                } else if (e == 2) {
                    clipboard.setString(this.privateKey)
                }

                modal.toast({
                    message: this.modal.copy_success,
                    duration: 2
                })   
            }

		}
	}
</script>

<style scoped >
.body {
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
		padding: 0 40px;
        background-color: #ffffff;
        height: 250px;
        flex-direction:column;
        /* align-items: center; */
        justify-content: center;
	}
	.open-key-box {
		height: 100px;
		font-size: 28px;
		padding: 10px 0;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color:#f2f3f5;

	}
    .open-key {
        height: 80px;
        width: 700px;
        background-color:#e6fef1;
        color: #1E90FF;
        line-height: 80px;
        padding: 0 10px;
        font-size: 28px;
        text-align: center;
    }

	.note {
		font-size: 32px;
		margin: 0 0 30px 0;
        
	}
	
	.password {
		font-size: 28px;
        height: 80px;
		/* margin-bottom: 100px; */
		border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
		padding-left: 20px;
        outline: none;
	}
	.btn-box {
		margin: 50px 0;
        width: 700px;
	}

    .main-two {
		padding: 40px 40px 20px 40px;

        /* flex-direction: row;
        align-items: center; */
        justify-content: center;
    }

    .main-three {
        padding: 15px;
	}
    .main-three-it {
        background-color: #ffffff;
        padding: 0 20px;
        height: 400px;
        /* box-shadow: 2px 2px 4px -1px gray; */
        border-radius: 10px;
    }
    .main-three-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 110px;
    }
    .main-three-item-title {
        width: 80px;
    }
    .main-three-item-content {
        width: 600px;
        word-break: keep-all;
        word-wrap: break-word;
    }
    .copy-box {
        height: 60px;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-right: 50px;
        margin-bottom: 10px;

    }
    .copy-box-item {
        flex-direction:row;
        align-items:center
    }
    .copy-box-text {
        font-size: 28px;
        color: #1E90FF;
        line-height: 60px;
    }
    .pop-header {
        flex-direction: row;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 20px;
        height: 120px;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
    }
    .tips {
        padding: 0 10px;
        font-size: 28px;
        letter-spacing: 2px;
    }

    .pop-header  .text{

        font-size: 32px;
        font-weight:bold;
    }
    .pop-middle {
        height: 300px;
        padding: 0 20px;
    }
    .pop-middle-item {
        height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-width: 1px;
        border-bottom-color: #C0C0C0;
        border-bottom-style: solid;
        padding: 0 10px;

    }
    .pop-middle-item-text {
        font-size: 28px;
        text-align: center;
    }
    .scroller {
        height: 480px;
    }
</style>
