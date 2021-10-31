package com.weex.app.extend;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Build;
import android.support.annotation.NonNull;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.paytomat.eos.Eos;
import com.paytomat.eos.PrivateKey;
import com.paytomat.eos.signature.Signature;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.ui.action.BasicComponentData;
import com.taobao.weex.ui.component.WXComponent;
import com.taobao.weex.ui.component.WXComponentProp;
import com.taobao.weex.ui.component.WXVContainer;
import com.weex.app.scatter.Scatter;
import com.weex.app.scatter.ScatterClient;
import com.weex.app.scatter.models.requests.MsgTransaction.MsgTransactionRequestParams;
import com.weex.app.scatter.models.requests.Transaction.request.TransactionRequestParams;

import org.bouncycastle.util.encoders.Hex;

import java.net.BindException;
import java.net.UnknownHostException;
import java.util.Date;

public class InjectionWebView extends WXComponent<WebView> {
    private Scatter scatterImplementation;
    private WebView webView;
    private WXSDKInstance instance;
    private static final String key = "5KVQ9WhxWeuF3KsysLgYfjiwYskJsUvvuGv1BNEA6ygJQqQyv6r";
    private static SocketServer socketServer;
    private static String accountName;
    private static String publicKey;

    private static String permission ;

    public static SocketServer getSocketServer(){
        return socketServer;
    }

//    public static String Sign(String data){
//        Signature signature = Eos.signTransactionRaw(data.getBytes(), new PrivateKey(key));
//        return signature.toString();
//    }

    private ScatterClient scatterClient = new ScatterClient() {
        @Override
        public void getAccount(ScatterClient.AccountReceived onAccountReceived) {
            onAccountReceived.onAccountReceivedSuccessCallback(accountName);
        }

        @Override
        public void completeTransaction(TransactionRequestParams transactionRequestParams, TransactionCompleted onTransactionCompleted) {
            System.out.println("JS注入 发生签名 1");
            String[] signatures = ScatterHelper.toEosTransaction(transactionRequestParams, new PrivateKey(key)).getPackedTx().getSignatures();
            onTransactionCompleted.onTransactionCompletedSuccessCallback(signatures);
        }

        @Override
        public void completeMsgTransaction(MsgTransactionRequestParams params, MsgTransactionCompleted onMsgTransactionCompleted) {
            System.out.println("JS注入 发生签名 2");
            Signature signature = Eos.signTransactionRaw(Hex.decode(params.getData()), new PrivateKey(key));
            onMsgTransactionCompleted.onMsgTransactionCompletedSuccessCallback(signature.toString());
        }

//        @Override
//        public void completeTransaction(TransactionRequestParams transactionRequestParams, TransactionCompleted onTransactionCompleted) {
//            System.out.println("completeTransaction: " + transactionRequestParams);
//            String[] signatures = ScatterHelper.toEosTransaction(transactionRequestParams, new PrivateKey(key)).getPackedTx().getSignatures();
//            onTransactionCompleted.onTransactionCompletedSuccessCallback(signatures);
//        }
//
//        @Override
//        public void completeMsgTransaction(MsgTransactionRequestParams params, MsgTransactionCompleted onMsgTransactionCompleted) {
//            System.out.println("Hex.decode(params.getData()): " + Hex.decode(params.getData()));
//            Signature signature = Eos.signTransactionRaw(Hex.decode(params.getData()), new PrivateKey(key));
//            onMsgTransactionCompleted.onMsgTransactionCompletedSuccessCallback(signature.toString());
//        }
    };

    public InjectionWebView(WXSDKInstance instance, WXVContainer parent, BasicComponentData basicComponentData) {
        super(instance, parent, basicComponentData);
        this.instance = instance;
    }

    @Override
    protected WebView initComponentHostView(@NonNull Context context) {
        webView = new WebView(context);
        scatterImplementation = new Scatter(webView, scatterClient);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);

        webView.setWebViewClient(new ScatterWebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
//        webView.setWebViewClient(new WebViewClient(){
//            @Override
//            public void onPageStarted(WebView view, String url, Bitmap favicon) {
//                super.onPageStarted(view, url, favicon);
//                System.out.println("[0825 Android] ============================================================ 页面开始加载 " + new Date().getTime());
//
//                try {
//                    if(socketServer == null){
//                        socketServer = new SocketServer(50005, instance);
////                      socketServer = new SocketServer(50005, instance);
//                        socketServer.setReuseAddr(true); //端口重用
//                        socketServer.start();
//                        System.out.println("dapp 端口开启！");
//                    }else {
//                        System.out.println("dapp 端口已开启，不再重复开启。");
//                    }
//                }catch (UnknownHostException e){
//                    e.printStackTrace();
//                    String errMsg = e.getMessage();
//                    System.out.println("0825 ERROR ERRMSG: " + errMsg);
//                }
//            }
//
//            @Override
//            public void onPageFinished(WebView view, String url) {
//                super.onPageFinished(view, url);
//                System.out.println("[0825 Android]页面加载完成 ============================================================ " + new Date().getTime());
//                instance.fireGlobalEventCallback("web_loaded",null);
//            }
//
//            @Override
//            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
//                super.onReceivedError(view, request, error);
//                System.out.println("[0825 Android]页面加载失败 " + new Date().getTime());
//            }
//        });
//
//        });
        return webView;
    }
    @WXComponentProp(name = "dappUrl")
    public void dappUrl(String data) {
        System.out.println("0824 dappUrl: " + data);
        if(data.length() == 0){
            return;
        }
//        data = "http://192.168.1.11:8080/,heng11223344,EOS6dTaKHvR2gsHZ43qANycZbEJZAQsasoqjGT3PmVK7Wp9gtRtVA,active";
        String[] dataArray =  data.split(",");
        if(dataArray.length == 1){
            return;
        }
        setAccountName(dataArray[1]);
        setPublicKey(dataArray[2]);
        setPermission(dataArray[3]);
        webView.loadUrl(dataArray[0]);
//        try {
//            if(socketServer == null){
//                socketServer = new SocketServer(50005, instance);
////                socketServer = new SocketServer(50005, instance);
//                socketServer.setReuseAddr(true); //端口重用
//                socketServer.start();
//                System.out.println("dapp 端口开启！");
//            }else {
//                System.out.println("dapp 端口已开启，不再重复开启。");
//            }
//        }catch (UnknownHostException e){
//            e.printStackTrace();
//            String errMsg = e.getMessage();
//            System.out.println("0825 ERROR ERRMSG: " + errMsg);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            String errMsg = e.getMessage();
//            System.out.println("0825 ERROR ERRMSG: " + errMsg);
//        }
    }

    @JSMethod
    public void changeUrl(String url){
        System.out.println("Url: " + url);
        webView.loadUrl(url);
    }

    public static String getAccountName() {
        return accountName;
    }

    public static void setAccountName(String accountName) {
        InjectionWebView.accountName = accountName;
    }

    public static String getPublicKey() {
        return publicKey;
    }

    public static void setPublicKey(String publicKey) {
        InjectionWebView.publicKey = publicKey;
    }

    public static String getPermission() {
        return permission;
    }

    public static void setPermission(String permission) {
        InjectionWebView.permission = permission;
    }

    private class ScatterWebViewClient extends WebViewClient {
        @TargetApi(Build.VERSION_CODES.N)
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            view.loadUrl(request.getUrl().toString());
            return true;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);

            super.onPageStarted(view, url, favicon);
            System.out.println("[0825 Android] ============================================================ 页面开始加载 " + new Date().getTime());

//            try {
//                if(socketServer == null){
//                    socketServer = new SocketServer(50005, instance);
////                      socketServer = new SocketServer(50005, instance);
//                    socketServer.setReuseAddr(true); //端口重用
//                    socketServer.start();
//                    System.out.println("dapp 端口开启！");
//                }else {
//                    System.out.println("dapp 端口已开启，不再重复开启。");
//                }
//            }catch (UnknownHostException e){
//                e.printStackTrace();
//                String errMsg = e.getMessage();
//                System.out.println("0825 ERROR ERRMSG: " + errMsg);
//            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            scatterImplementation.injectJS();
            System.out.println("[0825 Android]页面加载完成 ============================================================ " + new Date().getTime());
            instance.fireGlobalEventCallback("web_loaded",null);
        }
    }
}