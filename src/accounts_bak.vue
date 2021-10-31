<template>
    <div class="main" ref="accounts">
      	<!-- <div class="navigator">
            <wxc-minibar title="账号管理" background-color="#FFFFFF" text-color="#4ba363"
            :right-button="`${imgSrc}key`"
            @wxcMinibarLeftButtonClicked="goBack"
            @wxcMinibarRightButtonClicked="addPriKey"></wxc-minibar>
        </div> -->
        <div class="navigator">
				<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
				<text style="font-size: 36px; color: #1E90FF" >{{$t('zhLan.accounts.accounts_manage')}}</text>
				<image  :src="`${imgSrc}key`" style="height: 60px;width: 60px" @click="addPriKey"></image>
		</div>
        <scroller :style="scrollerStyle" class="scroller">
            <refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
                <text class="indicator-text">{{refreshText}}</text>
                <loading-indicator class="indicator"></loading-indicator>
            </refresh>
            <div class="accounts-box" v-for="(account,index) in accounts" :key="index">
                <div class="accounts-box-top">
                    <text class="accounts-box-top-text">{{publicKeyFormatter(account.PublicKey)}}</text>
                    <image :src="`${imgSrc}more_black`" mode="" style="height: 45px;width: 45px;" @click="openBottomPopup(account)"></image>
                </div>
                <div class="accounts-box-account" v-for="(item, index1) in account.Accounts" :key="index1" @click="switchAccount(item.Account,account.PublicKey)">
                    <text style="line-height:100px;font-size:32px">{{item.Account}}</text>
                    <image :src="item.Account == currentName?`${imgSrc}point`:''"  style="height: 20px;width: 20px;" :key="index1"></image>
                </div>
            </div>
        </scroller>
        

        <div class="footer">
            <div class="footer-item"  @click="createAccount">
                <image :src="`${imgSrc}new_add`" mode="" style="height: 45px;width: 45px; margin-right:15px"></image>
                <text style="font-size:32px">{{$t('zhLan.accounts.new_account')}}</text>
            </div>
            <div class="footer-item-di"><text style="font-size:36px">|</text></div>
            <div class="footer-item"  @click="importPreKey">
                <image :src="`${imgSrc}imp`" mode="" style="height: 45px;width: 45px; margin-right:15px"></image>
                <text  style="font-size:32px">{{$t('zhLan.accounts.import_prikey')}}</text>
                
            </div>
        </div>
        <wxc-dialog :title="`${$t('zhLan.accounts.confirm_delprikey')}`"
                    :content="`${$t('zhLan.accounts.confirm_delprikey_content')}`"
                    :show="showDialog"
                    :single="false"
                    :is-checked="false"
                    :cancel-text="`${$t('zhLan.accounts.cancel_delprikey_content')}`"
                    :confirm-text="`${$t('zhLan.accounts.confirm')}`"
					main-btn-color="#ff0000"
                    second-btn-color="#0000FF"
                    @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                    @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
        </wxc-dialog>
        <wxc-popup 
            :show="isBottomShow"
            @wxcPopupOverlayClicked="closePop"
            pos="bottom"
            height="600">
        <div>
            <div class="pop-header">
                <text class="text">{{$t('zhLan.accounts.prikeymanage')}}</text>
                <image :src="`${imgSrc}close`"  mode="" 
                    style="height: 45px;width: 45px; right:20px;position:absolute"
                    @click="closePop"></image>
            </div>
            <div class="pop-key">
                <text class="pop-key-text">{{publicKeyFormatter(chooseAccount.PublicKey)}}</text>
            </div>
            <div class="pop-middle">
                <div class="pop-middle-item" @click="goBackup">
                    <div>
                        <text class="pop-middle-item-text">{{$t('zhLan.accounts.backup_priley')}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="goModifyPwd">
                    <div>
                        <text class="pop-middle-item-text">{{$t('zhLan.accounts.alter_password')}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
                <div class="pop-middle-item" @click="goCreateAccountByPublicKey">
                    <div>
                        <text class="pop-middle-item-text">{{$t('zhLan.accounts.create_account')}}</text>
                    </div>
                    <image :src="`${imgSrc}right_gray`" mode="" style="height: 32px;width: 32px;"></image>
                </div>
            </div>
            <div class="pop-footer" @click="deletePeivateKey">
                <text class="pop-footer-text">{{$t('zhLan.accounts.delprikey')}}</text>
            </div>
        </div>
        </wxc-popup>
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
}

.accounts-box {
    width: 750px;
    padding: 20px;
    line-height: 100px;
    margin-bottom: 10px;
    background-color:#f2f3f5;
    /* background-color: #ffffff; */
    /* flex-direction: row;
    align-items: center;
    justify-content: space-between; */
}

.accounts-box-top {
    /* width: 750px; */
    height: 100px;
    /* margin: 20px 0;
    padding: 20px; */
    line-height: 100px;
    
    /* background-color: #ffffff; */
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.accounts-box-account {
    background-color: #ffffff;
    border-radius: 10px;
    height: 100px;
    margin: 10px 5px;
    /* box-shadow:2px 2px 6px -2px gray; */
    padding: 0 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.accounts-box-item-left {
    flex-direction: row;
    line-height: 100px;
}
.footer {
    position: absolute;
    bottom: 0;
    height: 120px;
    width: 750px;
    flex-direction: row;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
}
.footer-item {
    width: 350px;
    line-height: 120px;
    text-align: center;
    font-size:36px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.footer-item-di {
    line-height: 120px;
    text-align: center;
    font-size: 36px;
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

.text{

    font-size:36px;
    font-weight:bold;
}
.pop-key {
    flex-direction: row;
    justify-content: center;
    padding: 10px;
    background-color:#f2f3f5;
    align-items: center;
    height: 80px;
}
.pop-key-text {
    color: gray;
    font-size: 32px;
    letter-spacing: 2px;
}
.pop-middle {
    height: 300px;
    padding: 0 20px;
}
.pop-middle-item {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    padding: 0 10px;

}
.pop-middle-item-text {
    font-size: 32px;
}
.pop-footer {
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.pop-footer-text {
    font-size: 32px;
    color: rgb(212, 5, 5);
    font-weight: bold;
}
.accounts-box-top-text {
    font-size: 32px;
    color: gray;
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
import {switchAccount, delLocalKey, getAccountByPublicKey, addLocalAccount, getCurrentAccountInfo} from './utils/account'
import {imgSrc, getStorage} from './utils/config'
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal')
const animation = weex.requireModule('animation')
export default {
    components: {
		WxcMinibar, WxcPopup, WxcDialog
    },
    
  data() {
      return {
          isBottomShow: false,
          accounts:[],
          imgSrc: imgSrc,
          chooseAccount:{},
          showDialog: false,
          scrollerH: '',
          srollerStyle: {},
          refreshing: false,
          refreshText: "下拉刷新",
          currentName: ''
      }
  },
  beforeCreate() {
      const tabPageHeight = Utils.env.getPageHeight();
      console.log("获取到高度"+tabPageHeight)
      this.scrollerH = (tabPageHeight- 120) +'px'
      this.scrollerStyle = {
          height:this.scrollerH  
      }
  },
  async created() {
    //   await this.updateAccounts()
      let currentAccount = JSON.parse(await getStorage("Account"))
      this.currentName = currentAccount.account_name
      await this.getAccounts()
  },

  ready() {
      console.log("已准备")
  },
    mounted() {
        var testEl = this.$refs.accounts;
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
  computed: {
      
  },
  methods: {
      async updateAccounts() {
        let accounts = JSON.parse(await getStorage("AccountManager"))
        for (let index = 0; index < accounts.length; index++) {
            let account = accounts[index];
            let publicKey = account.PublicKey
            let privateKeyEncrypt = account.PrivateKeyEncrypt
            let passwordEncrypt = account.PasswordEncrypt
            // 获取该公钥下账号信息
            console.log("获取该公钥下账号信息")
            let res = await getAccountByPublicKey(account.PublicKey)
            console.log(res)
            let accounts1 = []


            for(let i = 0; i < res.account_names.length; i++) {
                let info = await getCurrentAccountInfo(res.account_names[i])
                console.log("获取到账号信息："+JSON.stringify(info))
                console.log(info)
                console.log("账号名称为"+info.account_name)
                let permissions = []
                for(let j = 0; j < info.permissions.length; j++) {
                    console.log()
                    permissions.push(info.permissions[j].perm_name)
                }
                console.log(permissions)
                let account1 = {
                    Account: res.account_names[i],
                    Permission: permissions,
                    Currency : ["YAS"]
                }

                accounts1.push(account1)
            }

            console.log("*********222")
            console.log(accounts1)
            // 构建账号信息数据
            let account2 = {
                PublicKey: publicKey,
                PrivateKeyEncrypt: privateKeyEncrypt,
                PasswordEncrypt: passwordEncrypt,
                Accounts: accounts1
            }

            // 账号信息保存到本地
            addLocalAccount(account2)
            
        }  
      },
      async getAccounts() {
        this.accounts = JSON.parse(await getStorage("AccountManager"))
      },
      goBack() {
          console.log("点击了返回按钮")
          this.$router.go(-1)
      },
      createAccount() {

          this.$router.push('/create_account')
      },
      importPreKey() {
          this.$router.push('/private_key_import')
      },
      goBackup() {
          this.$router.push({path: '/private_key_backup', query:{publicKey:this.chooseAccount.PublicKey}})
      },
      goCreateAccountByPublicKey() {
          this.$router.push({path: '/create_account', query:{publicKey:this.chooseAccount.PublicKey}})
      },

      // 修改密码
      goModifyPwd() {
          this.$router.push({path: '/alter_password', query:{publicKey:this.chooseAccount.PublicKey}})
      },
      addPriKey() {
          this.$router.push('private_key_create')
      },

      closePop () {
        this.isBottomShow = false;
      },
      openBottomPopup (item) {
        this.isBottomShow = true;
        console.log(item)
        this.chooseAccount = JSON.parse(JSON.stringify(item))
        console.log(this.chooseAccount.PublicKey)
      },
      publicKeyFormatter(publicKey) {
        return publicKey? publicKey.substring(0,9) + "..." + publicKey.substring(publicKey.length-10,publicKey.length): ""
      },
      async showPoint(item) {
        let curAccount =  JSON.parse( await getStorage("Account"))

        console.log("item："+item)
        if (item == curAccount.account_name) {
            console.log("成功试试")
            return true
        }

        return false
      },
      async switchAccount(account, publicKey) {
        await switchAccount(account, publicKey)
        // storage.getItem("AccountManager", res =>{
        //     this.accounts = {}
        //     this.accounts = JSON.parse(res.data)
        //     console.log("获取到账号列表aa" + JSON.stringify(this.accounts))
        //     console.log(this.accounts.length)
        // })
        this.currentName = account
        this.accounts = JSON.parse(await getStorage("AccountManager"))
        
        modal.toast({
            message: this.$t('zhLan.modal.account_change_success'),
            duration: 2
        })
        
        this.$router.go(-1)
 
        
      },
      wxcDialogCancelBtnClicked() {
          this.showDialog = false
          this.isBottomShow = false
      },
      async wxcDialogConfirmBtnClicked() {

          await delLocalKey(this.chooseAccount.PublicKey)
        //   this.accounts = []
        //   storage.getItem("AccountManager", res =>{
        //     this.accounts = []
        //     this.accounts = JSON.parse(res.data)
        //     console.log("获取到账号列表ss" + JSON.stringify(this.accounts))
        //     console.log(this.accounts.length)
        //     })

            this.accounts = JSON.parse(await getStorage("AccountManager"))


          modal.toast({
              message: this.$t('zhLan.modal.account_delsuccess'),
              duration: 2
          })
          this.$router.go(-1)
          this.showDialog = false
          this.isBottomShow = false
          this.chooseAccount = {}
          
          
      },
      deletePeivateKey() {
          this.showDialog = true
      },

      async onrefresh (event) {
        // modal.toast({ message: 'Refreshing', duration: 1 })
        this.refreshing = true
        this.refreshText = "刷新中。。。"
        // await this.updateAccounts()
        await this.getAccounts()

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