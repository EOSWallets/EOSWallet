package com.weex.app;

import android.app.Application;
import android.os.Build;
import android.os.StrictMode;

import com.weex.app.extend.CommentSDKWeexImageAdapter;
import com.weex.app.extend.ImageAdapter;
import com.weex.app.extend.InjectionWebView;
import com.weex.app.extend.WXEventModule;
import com.alibaba.weex.plugin.loader.WeexPluginContainer;
import com.weex.app.util.AppConfig;
import com.taobao.weex.InitConfig;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.common.WXException;
import com.weex.app.util.ScanModule;

public class WXApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate();
//    StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//    StrictMode.setVmPolicy(builder.build());
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//
      StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
      StrictMode.setVmPolicy(builder.build());
      builder.detectFileUriExposure();
    }
    WXSDKEngine.addCustomOptions("appName", "WXSample");
    WXSDKEngine.addCustomOptions("appGroup", "WXApp");
//    new InitConfig.Builder().setImgAdapter(new ImageAdapter()).build()
    WXSDKEngine.initialize(this,
            new InitConfig.Builder().setImgAdapter(new CommentSDKWeexImageAdapter()).build()
    );
    try {
      WXSDKEngine.registerModule("event", WXEventModule.class);
      WXSDKEngine.registerComponent("injectionWebView", InjectionWebView.class);

      // 这里module名称可以自定义
      WXSDKEngine.registerModule("zfjg-scan", ScanModule.class);
    } catch (WXException e) {
      e.printStackTrace();
    }
    AppConfig.init(this);
    WeexPluginContainer.loadAll(this);
  }
}
