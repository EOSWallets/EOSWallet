package com.weex.app.scatter;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.google.gson.Gson;
import com.weex.app.scatter.models.ScatterRequest;

import static com.weex.app.scatter.ScatterService.getAppInfo;
import static com.weex.app.scatter.ScatterService.getEosAccount;
import static com.weex.app.scatter.ScatterService.requestMsgSignature;
import static com.weex.app.scatter.ScatterService.requestSignature;
import static com.weex.app.scatter.models.MethodName.GET_APP_INFO;
import static com.weex.app.scatter.models.MethodName.GET_EOS_ACCOUNT;
import static com.weex.app.scatter.models.MethodName.REQUEST_MSG_SIGNATURE;
import static com.weex.app.scatter.models.MethodName.REQUEST_SIGNATURE;

public class TestCallJava {
    private static String TAG = "<<SS";

    private WebView webView;
    private ScatterClient scatterClient;

    TestCallJava(WebView webView, ScatterClient scatterClient) {
//        TestCallJava() {
        this.webView = webView;
        this.scatterClient = scatterClient;
        System.out.println("Init ScatterWebInterface");
    }

    @JavascriptInterface
    public void pushMessage(String data) {
        System.out.println("【pushMessage】 data: " + data);

        Gson gson = new Gson();
        ScatterRequest scatterRequest = gson.fromJson(data, ScatterRequest.class);


        System.out.println("scatterRequest.getMethodName(): " + scatterRequest.getMethodName());
        switch (scatterRequest.getMethodName()) {
            case GET_APP_INFO: {
                System.out.println("GET_APP_INFO");
                getAppInfo(webView, scatterClient);
                break;
            }
            case GET_EOS_ACCOUNT: {
                System.out.println("GET_EOS_ACCOUNT");
                getEosAccount(webView, scatterClient);
                break;
            }
            case REQUEST_SIGNATURE: {
                System.out.println("REQUEST_SIGNATURE");
                requestSignature(scatterRequest.getParams(), webView, scatterClient);
                break;
            }
            case REQUEST_MSG_SIGNATURE: {
                System.out.println("REQUEST_MSG_SIGNATURE");
                requestMsgSignature(scatterRequest.getParams(), webView, scatterClient);
                break;
            }
            default:
                System.out.println("default");
                break;
        }
    }
}