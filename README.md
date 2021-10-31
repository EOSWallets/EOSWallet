一、如何修改、编译和测试EOSWallet钱包项目

1. 拉取项目代码到本地后，进入项目根目录运行命令npm install

[![Crd1ah.png](https://www.helloimg.com/images/2021/10/31/Crd1ah.png)](https://www.helloimg.com/image/Crd1ah) 

2. 运行 npm start：可以用浏览器查看APP效果

[![CrdqGr.png](https://www.helloimg.com/images/2021/10/31/CrdqGr.png)](https://www.helloimg.com/image/CrdqGr) 

3. 启动安卓模拟器和Android Studio

(1) 安卓模拟器用的是夜神模拟器（请先确保模拟器可以正常使用）

(2) Android Studio打开项目根目录下的/platforms/android路径，这个文件夹中就是weex生成的Android项目（请先确保Android Studio的开发环境正常）

 

4. 连接模拟器到Android Studio

运行命令 adb.exe connect 127.0.0.1:62001

[![CrdJjK.png](https://www.helloimg.com/images/2021/10/31/CrdJjK.png)](https://www.helloimg.com/image/CrdJjK)

 

5. 运行 weex run android

[![CrdsEb.png](https://www.helloimg.com/images/2021/10/31/CrdsEb.png)](https://www.helloimg.com/image/CrdsEb) 

 

6. 但基本不期望上面这个命令来启动APP，所以还是进入Android Studio，等待自动处理完依赖，然后确认连接到模拟器之后，点击运行即可在模拟器中看到启动的APP 

[![CrdtOo.png](https://www.helloimg.com/images/2021/10/31/CrdtOo.png)](https://www.helloimg.com/image/CrdtOo  =40x30)

7. 修改项目之后如何重新编译并生成APP

当你修改了项目之后，只需要重新运行 weex run android 命令，然后在AndroidStudio中点击运行，即可在模拟器中看到你的修改已经生效。

 

提示：甚至你都不需要等待weex run andorid完全执行完毕，大概在这两步[![Crd4kD.png](https://www.helloimg.com/images/2021/10/31/Crd4kD.png)](https://www.helloimg.com/image/Crd4kD)结束之后，就可以重新运行AndroidStudio生成APP了

 

二、钱包项目功能展示

1. 钱包首页——资产页面

初次进入APP时，页面如下，并且会提示请先导入账号。此时点击左上角的“切换账号”按钮然后点击弹出框的齿轮则可以进入账号管理页面。

或者点击“我的” - “账号管理”可以同样进入账号管理页面。

点击右上角的加号按钮，可以导入或新增私钥。

 

[<img src="https://www.helloimg.com/images/2021/10/31/CrdL1S.png" alt="CrdL1S.png" style="zoom:25%;" />](https://www.helloimg.com/image/CrdL1S)[<img src="https://www.helloimg.com/images/2021/10/31/CrdSlC.png" alt="CrdSlC.png" style="zoom:25%;" />](https://www.helloimg.com/image/CrdSlC) [<img src="https://www.helloimg.com/images/2021/10/31/CrdHRt.png" alt="CrdHRt.png" style="zoom:25%;" />](https://www.helloimg.com/image/CrdHRt)[<img src="https://www.helloimg.com/images/2021/10/31/Crdv6P.png" alt="Crdv6P.png" style="zoom:25%;" />](https://www.helloimg.com/image/Crdv6P)[<img src="https://www.helloimg.com/images/2021/10/31/Crd0R6.png" alt="Crd0R6.png" style="zoom:25%;" />](https://www.helloimg.com/image/Crd0R6)

 

2. 支持转账、资源管理、权限管理等操作

   [![CrdNLn.png](https://www.helloimg.com/images/2021/10/31/CrdNLn.png)](https://www.helloimg.com/image/CrdNLn)

3. 支持Dapp，你可以从地址栏访问dapp，并且将保存你访问过的dapp的历史记录

   [![CrdQQR.png](https://www.helloimg.com/images/2021/10/31/CrdQQR.png)](https://www.helloimg.com/image/CrdQQR)

   

   

   