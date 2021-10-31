package com.weex.app.util;

import com.google.zxing.integration.android.IntentIntegrator;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;
import com.weex.app.WXPageActivity;

public class ScanModule extends WXModule {
    @JSMethod
    public void scanCode(JSCallback callback) {
        WXPageActivity act = (WXPageActivity)mWXSDKInstance.getContext();
        act.setOnScanFinishCallback(callback);

        IntentIntegrator integrator = new IntentIntegrator(act);
        integrator.initiateScan();
    }
}
