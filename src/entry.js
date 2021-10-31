import Vue from 'vue';
import weex from 'weex-vue-render';

weex.init(Vue);


//初始化数据
//账号管理器
const storage = weex.requireModule('storage');
storage.getItem("AccountManager", res =>{
    if(res.result == "failed"){
        let AccountManager = []
        storage.setItem("AccountManager",  JSON.stringify(AccountManager), res =>{
            console.log("账号管理器初始化 - OK") 
        })
        return 
    }
})
storage.getItem("AccountManager_v2", res =>{
    // if(res.result == "failed"){
        let AccountManager = {
            CurrentChain:"",
            YAS:[{
                PublicKey: "EOS6dTaKHvR2gsHZ43qANycZbEJZAQsasoqjGT3PmVK7Wp9gtRtVA",
                PrivateKeyEncrypt: "F993B456D031BE199B82FB27C950312C0A07AAE19A990983A2A0F9FC939FA465BD662F3C3732F2A8C6660BBA815152E4F333158B4269C5A00E1E7DA7FC5E4898",
                PasswordEncrypt: "d18106d812fab582e1eefd4df2a47ba0",
                Accounts: [
                    {
                        Account: "happy.me",
                        Permission: [
                            "active",
                            "owner"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    },
                    {
                        Account: "heng11223344",
                        Permission: [
                            "active",
                            "owner"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    }
                ]
            },{
                PublicKey: "EOS6pqpAzLcQBg1jDkH2oVrpDuSWMKvcAdBbJyK1n5zxuTwuemoHn",
                PrivateKeyEncrypt: "5JoSn7i1ANQ4gtP7TucwcG4kHTzNcaPXKoxn9vm7dZLgmUcEt1s",
                PasswordEncrypt: "123456",
                Accounts: [
                    {
                        Account: "testforyas11",
                        Permission: [
                            "active"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    }
                ]
            },{
                PublicKey: "EOS6pqpAzLcQBg1jDkH2oVrpDuSWMKvcAdBbJyK1n5zxuTwuemoHn",
                PrivateKeyEncrypt: "5JoSn7i1ANQ4gtP7TucwcG4kHTzNcaPXKoxn9vm7dZLgmUcEt1s",
                PasswordEncrypt: "123456",
                Accounts: [
                    {
                        Account: "testforyas11",
                        Permission: [
                            "active"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    }
                ]
            },{
                PublicKey: "EOS6pqpAzLcQBg1jDkH2oVrpDuSWMKvcAdBbJyK1n5zxuTwuemoHn",
                PrivateKeyEncrypt: "5JoSn7i1ANQ4gtP7TucwcG4kHTzNcaPXKoxn9vm7dZLgmUcEt1s",
                PasswordEncrypt: "123456",
                Accounts: [
                    {
                        Account: "testforyas11",
                        Permission: [
                            "active"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    }
                ]
            },{
                PublicKey: "EOS6pqpAzLcQBg1jDkH2oVrpDuSWMKvcAdBbJyK1n5zxuTwuemoHn",
                PrivateKeyEncrypt: "5JoSn7i1ANQ4gtP7TucwcG4kHTzNcaPXKoxn9vm7dZLgmUcEt1s",
                PasswordEncrypt: "123456",
                Accounts: [
                    {
                        Account: "testforyas11",
                        Permission: [
                            "active"
                        ],
                        Currency: [
                            "YAS"
                        ]
                    }
                ]
            }],
            TNT:[{
                    PublicKey: "EOS6pqpAzLcQBg1jDkH2oVrpDuSWMKvcAdBbJyK1n5zxuTwuemoHn",
                    PrivateKeyEncrypt: "5JoSn7i1ANQ4gtP7TucwcG4kHTzNcaPXKoxn9vm7dZLgmUcEt1s",
                    PasswordEncrypt: "123456",
                    Accounts: [
                        {
                            Account: "gixgaynfcjme",
                            Permission: [
                                "active"
                            ],
                            Currency: [
                                "TNT"
                            ]
                        }
                    ]
                }],
            EOS:[]
        }
        storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager), res =>{
            console.log("账号管理器初始化 - OK") 
        })
        return 
    // }
})
//当前账号
storage.getItem("Account", res =>{
    if(res.result == "failed"){
        let Account = {}
        storage.setItem("Account",  JSON.stringify(Account), res =>{
            console.log("当前账号初始化 - OK") 
        })
        return
    }
})
//本地所有账号持有的所有代币及其价格
storage.getItem("Currency", res =>{
    if(res.result == "failed"){
        let Currency  = new Map()
        storage.setItem("Currency",  JSON.stringify(Currency), res =>{
            console.log("代币列表初始化 - OK") 
        })
        return
    }
})

//本地所有账号持有的转账记录
storage.getItem("trans_record", res =>{
    if(res.result == "failed"){
        let Currency  = []
        storage.setItem("trans_record",  JSON.stringify(Currency), res =>{
            console.log("转账记录初始化 - OK") 
        })
        return
    }
})

storage.getItem("lan", res =>{
    if(res.result == "failed"){
        storage.setItem("lan",  'zh-CN', res =>{
            console.log("语言初始化 - OK") 
        })
        return
    }
})