package com.weex.app.scatter;

import android.util.Log;
import android.webkit.WebView;

import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.util.Scanner;

import static com.weex.app.scatter.ScatterService.injectJs;

public class Scatter {
    private static String TAG = "<<SS";
    private String javascriptInterfaceName = "JsBridge";

    private WeakReference<WebView> webView;
    private ScatterClient scatterClient;

    public Scatter(WebView webView, ScatterClient scatterClient) {
        System.out.println("【Debug】Scatter Init");
        this.webView = new WeakReference<>(webView);
        this.scatterClient = scatterClient;
        initInterface();
    }

    private void initInterface() {
        if (webView.get() != null) {
//            webView.get().addJavascriptInterface(new ScatterWebInterface(webView.get(), scatterClient), "JsBridge");
//            webView.get().addJavascriptInterface(new TestCallJava(webView.get(), scatterClient), "JsBridge");
            webView.get().addJavascriptInterface(new TestCallJava(webView.get(), scatterClient), "callJava");
            System.out.println("【Debug】initInterface 完成");
        }
    }

    public void injectJS() {
        try {
            System.out.println("【Debug】injectJS");
            if (webView.get() != null) {
                InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("assets/scatterkit_script.js");

                Scanner s = new Scanner(inputStream).useDelimiter("\\A");
                String jsScript = s.hasNext() ? s.next() : "";

                final String script = new StringBuilder().append("var SP_SCRIPT = document.createElement('script');\n")
                        .append("var SP_USER_AGENT_ANDROID = \"").append(webView.get().getSettings().getUserAgentString()).append("\";\n")
                        .append("var SP_USER_AGENT_IOS = \"SP_USER_AGENT_IOS\";\n")
                        .append("var SP_TIMEOUT = ").append(60 * 1000).append(";\n")
                        .append("SP_SCRIPT.type = 'text/javascript';\n")
                        .append("SP_SCRIPT.text = \"")
                        .append(jsScript)
                        .append("\";document.getElementsByTagName('head')[0].appendChild(SP_SCRIPT);").toString();

                injectJs(webView.get(), script);
            }
        } catch (Exception e) {
            Log.d(TAG, "Some error with Scatter js file, err: " + e);
        }
    }

    public void removeInterface() {
        if (webView.get() != null) {
            webView.get().removeJavascriptInterface(javascriptInterfaceName);
            webView.clear();
        }
    }
}
