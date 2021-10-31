package com.weex.app.extend;

import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.weex.app.WXPageActivity;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.common.WXModule;

import org.java_websocket.WebSocket;

import java.util.List;


public class WXEventModule extends WXModule {
  class SignaturesObj {
    class Signatures {

      private List<String> signatures;
      public void setSignatures(List<String> signatures) {
        this.signatures = signatures;
      }
      public List<String> getSignatures() {
        return signatures;
      }

    }
    private String id;
    private Signatures signatures;
    public void setId(String id) {
      this.id = id;
    }
    public String getId() {
      return id;
    }

    public void setSignatures(Signatures signatures) {
      this.signatures = signatures;
    }
    public Signatures getSignatures() {
      return signatures;
    }

  }

  @JSMethod()
  public void returnSignRusult(String data) {
    try{
      int startIndex = data.indexOf("\"serializedTransaction\"");
      String temp = data.substring(startIndex);
      int endIndex = temp.indexOf("},");
      String tempEnd = temp.substring(endIndex + "},".length());
      String tempStart = data.substring(0, startIndex);
      String doneStr = tempStart + tempEnd;

      Gson gson = new Gson();
      SignaturesObj result = gson.fromJson(data, SignaturesObj.class);
      SocketServer socketServer = InjectionWebView.getSocketServer();
      WebSocket conn = socketServer.getConn();
      String resp = "42/scatter,[\"api\",{\"result\":{\"returnedFields\":{},\"signatures\":[\""+ result.getSignatures().getSignatures().get(0) +"\"]},\"id\":\"" + result.getId() +"\"}]";
      conn.send(resp);
    }catch (Exception e){
      System.out.println("[ERROR] returnSignRusult: " + e);
    }
  }

  @JSMethod()
  public void openURL(String url) {
    if (TextUtils.isEmpty(url)) {
      return;
    }
    Uri uri = Uri.parse(url);
    String scheme = uri.getScheme();

    if (scheme.equals("http") || scheme.equals("https") || scheme.equals("file")) {
      Intent renderIntent = new Intent(mWXSDKInstance.getContext(), WXPageActivity.class);
      renderIntent.setData(uri);
      mWXSDKInstance.getContext().startActivity(renderIntent);
    } else {
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setData(uri);
      mWXSDKInstance.getContext().startActivity(intent);
    }
  }

  private String getItem(String originData, String itemName){
    itemName = "\"" + itemName + "\":";
    System.out.println("itemName: " + itemName);
    int startIndex = originData.indexOf(itemName) + itemName.length();
    String tempStr = originData.substring(startIndex,originData.length());
    int endIndex = tempStr.indexOf(",") + startIndex;
    String itemStr = originData.substring(startIndex+1, endIndex-1);
    System.out.println("itemStr: " + itemStr);
    return itemStr;
  }

  class signResult{
    private String id;
    private String signatures;

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getSignatures() {
      return signatures;
    }

    public void setSignature(String signatures) {
      this.signatures = signatures;
    }

    @Override
    public String toString() {
      return "signResult{" +
              "id='" + id + '\'' +
              ", signatures='" + signatures + '\'' +
              '}';
    }
  }
}
