一、如何修改、编译和测试EOSWallet钱包项目

1. 拉取项目代码到本地后，进入项目根目录运行命令npm install

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC299.tmp.jpg) 

2. 运行 npm start：可以用浏览器查看APP效果

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29A.tmp.jpg) 

3. 启动安卓模拟器和Android Studio

(1) 安卓模拟器用的是夜神模拟器（请先确保模拟器可以正常使用）

(2) Android Studio打开项目根目录下的/platforms/android路径，这个文件夹中就是weex生成的Android项目（请先确保Android Studio的开发环境正常）

 

4. 连接模拟器到Android Studio

运行命令 adb.exe connect 127.0.0.1:62001

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29B.tmp.jpg) 

 

5. 运行 weex run android

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29C.tmp.jpg) 

 

6. 但基本不期望上面这个命令来启动APP，所以还是进入Android Studio，等待自动处理完依赖，然后确认连接到模拟器之后，点击运行即可在模拟器中看到启动的APP

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29D.tmp.jpg) 

模拟器中：![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29E.tmp.jpg)

 

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC29F.tmp.jpg) 

7. 修改项目之后如何重新编译并生成APP

当你修改了项目之后，只需要重新运行 weex run android 命令，然后在AndroidStudio中点击运行，即可在模拟器中看到你的修改已经生效。

 

提示：甚至你都不需要等待weex run andorid完全执行完毕，大概在这两步![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A0.tmp.jpg)结束之后，就可以重新运行AndroidStudio生成APP了

 

二、钱包项目功能展示

1. 钱包首页——资产页面

初次进入APP时，页面如下，并且会提示请先导入账号。此时点击左上角的“切换账号”按钮然后点击弹出框的齿轮则可以进入账号管理页面。

或者点击“我的” - “账号管理”可以同样进入账号管理页面。

点击右上角的加号按钮，可以导入或新增私钥。

 

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A1.tmp.png)![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A2.tmp.png) ![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A3.tmp.png)![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A4.tmp.jpg)![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A5.tmp.png)

 

2. 支持转账、资源管理、权限管理等操作

![img](file:///C:\Users\A\AppData\Local\Temp\ksohtml\wpsC2A6.tmp.png)<img src="file:///D:\QQ\Document\986472954\Image\C2C\B5A0D4443D5C76ADD6D97B6B4106F85A.jpg" alt="img" style="zoom:25%;" /><img src="file:///D:\QQ\Document\986472954\Image\C2C\DE3D915420E091064C64E2E74085A527.jpg" alt="img" style="zoom:25%;" /><img src="file:///D:\QQ\Document\986472954\Image\C2C\EF8A54D4E095B43E20B7A642FAFA3ACB.jpg" alt="img" style="zoom:25%;" />

3. 支持Dapp，你可以从地址栏访问dapp，并且将保存你访问过的dapp的历史记录

   <img src="file:///D:\QQ\Document\986472954\Image\C2C\F39B4ECA15B6D621F1AA57FB354C2AF4.jpg" alt="img" style="zoom:25%;" /><img src="file:///D:\QQ\Document\986472954\Image\C2C\13387F24D5680786202AB0B53126CAF5.jpg" alt="img" style="zoom:25%;" />

   

   

   