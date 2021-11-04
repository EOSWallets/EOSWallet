const storage = weex.requireModule('storage');

//重新初始化公链数据
export async function initChain(){
    return new Promise(async function (resolve) {        
        storage.getItem("ChainManager", async res =>{
            if(res.result == "failed"){
                let ChainManager = {
                    CurrentChain: "EOS", //当前所在链
                //     YAS: {
                //        ChainName: "YAS",
                //        chainId: "ed8636abfe625d99fc9a759d49a016fd8dcae9193676a020aae2540c9fffe32f",
                //        ContractAccount: "eosio",
                //        CurrentNode:"https://yas.maiziqianbao.net",
                //        Nodes: [
                //         {
                //             Name: 'Math',
                //             Url: 'https://yas.maiziqianbao.net'
                //         },
                //         {
                //             Name: 'Yas Plus',
                //             Url: 'https://rpc.yas.plus.com'
                //         }
                //        ]
                //     },
                //     TNT: {
                //        ChainName: "TNT",
                //        chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
                //        ContractAccount: "eosio",
                //        CurrentNode:"https://api.testnet.eos.io",
                //        Nodes: [
                //         {
                //             Name: 'Testnet',
                //             Url: 'https://rpc.yas.plus.com'
                //         }
                //        ]
                //     },                
                    EOS: {
                       ChainName: "EOS",
                       chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
                       ContractAccount: "eosio",
                       CurrentNode:"http://openapi.eos.ren",
                       Nodes: [
                        {
                            Name: 'EOS',
                            Url: 'http://openapi.eos.ren'
                        }
                       ]
                    }
                }
                storage.setItem("ChainManager",  JSON.stringify(ChainManager), res =>{
                    console.log("公链列表初始化 - OK") 
                })
                resolve(ChainManager);
            }            
            //设置账号管理器的当前公链
            storage.getItem("AccountManager_v2", async res =>{
                let AccountManager = JSON.parse(res.data);
                console.log("AccountManager_v2: ", AccountManager)
                let chain = await getCurrentChain()
                console.log("chain: ", chain)
                AccountManager.CurrentChain = chain.ChainName;
                storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager))
                console.log("重置了AccountManager的公链")

            })  
        })
    });
}

//获取当前所在公链数据
export function getCurrentChain(){
    return new Promise(function (resolve) {
        storage.getItem("ChainManager", async res =>{
            if(res.result == "failed"){
                let chainManager = await initChain();
                return chainManager[chainManager.CurrentChain];
            }
            let chainManager = JSON.parse(res.data);
            resolve(chainManager[chainManager.CurrentChain]);
        })
    });
}

//切换公链
export function switchChain(chainName){
    return new Promise(function (resolve,reject) {
        storage.getItem("ChainManager", async res =>{
            let chainManager;
            if(res.result == "failed"){
                chainManager = await initChain();
            }else{
                chainManager = JSON.parse(res.data);
            }
            //判断公链是否存在
            if(chainManager[chainName]){
                chainManager.CurrentChain = chainName;
                storage.setItem("ChainManager",  JSON.stringify(chainManager))
                //设置账号管理器的当前公链
                storage.getItem("AccountManager_v2", res =>{
                    let AccountManager = JSON.parse(res.data);
                    AccountManager.CurrentChain = chainName;
                    storage.setItem("AccountManager_v2",  JSON.stringify(AccountManager))
                })  
            }else{
                reject("公链不存在")
            }
        })
    });
}
