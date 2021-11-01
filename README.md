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

