![EOSWallet logo](logo.png?raw=true)

# EOSWallet

EOSWallet is an open source wallet framework focusing on the EOS blockchain, which can support functions such as transfer, resource management, permission management, and access to Dapps.

## Building Locally

The code is built using Weex and running code locally requires Android Studio and Nodejs.

-   Install [Node.js](https://nodejs.org) **version 14 (latest stable) **

-   Install weex-cli by running:

```bash
npm install weex-toolkit -g
```

-   Clone this repo and install our dependencies:

```bash
git clone https://github.com/EOSWallets/EOSWallet.git
cd EOSWallet
npm install
npm start
```

-   Then, run the weex command to compile the wallet APP project

```bash
# On the Android platform
weex run android

# On the iOS platform
weex platform add ios
weex run ios
```

- Finally, use Android Studio to open the Android project under /EOSWallet/platforms/, then click the run button in Android Studio to start testing the APP

#### Wallet APP

- **Home Page**

<img src="https://www.helloimg.com/images/2021/11/01/CV3HFn.jpg" alt="CV3HFn.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Home Page - Wallet Manager**

<img src="https://www.helloimg.com/images/2021/11/01/CV3bnR.jpg" alt="CV3bnR.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Transfer**

<img src="https://www.helloimg.com/images/2021/11/01/CV3lzz.jpg" alt="CV3lzz.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Source Manage**

<img src="https://www.helloimg.com/images/2021/11/01/CV3UUQ.jpg" alt="CV3UUQ.jpg" border="0" width="40%" height="40%" style="display:inline;" />



- **Authority Manage**

<img src="https://www.helloimg.com/images/2021/11/01/CV3rnu.jpg" alt="CV3rnu.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Receipt**

<img src="https://www.helloimg.com/images/2021/11/01/CV3uhX.jpg" alt="CV3uhX.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Dapps Page**

<img src="https://www.helloimg.com/images/2021/11/01/CVXoDR.jpg" alt="CVXoDR.jpg" border="0" width="40%" height="40%" style="display:inline;"/>



- **Dapps Search Page**

<img src="https://www.helloimg.com/images/2021/11/01/CVXPCz.jpg" alt="CVXPCz.jpg" border="0" width="40%" height="40%" style="display:inline;"/>
