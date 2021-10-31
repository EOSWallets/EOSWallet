package com.weex.app.extend;

import com.google.gson.Gson;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.WXSDKInstance;
import com.weex.app.extend.SocketObject.Pair;
import com.weex.app.extend.SocketObject.signatureReqV1.signatureReqv1;

import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.drafts.Draft_6455;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class SocketServer extends WebSocketServer {

    private String appkey;
    private WXSDKInstance instance;
    private WebSocket conn;

    OkHttpClient client = new OkHttpClient();
    String httpGet(String url) throws IOException {
        Request request = new Request.Builder().url(url).build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {
            return response.body().string();
        } else {
            throw new IOException("Unexpected code " + response);
        }
    }

    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    public SocketServer(int port, WXSDKInstance instance) throws UnknownHostException {
        super( new InetSocketAddress( port ) );
        this.instance = instance;
    }

    public WebSocket getConn(){
        return conn;
    }

    public SocketServer(InetSocketAddress address ) {
        super( address );
    }

    public SocketServer(int port, Draft_6455 draft) {
        super( new InetSocketAddress( port ), Collections.<Draft>singletonList(draft));
    }

    @Override
    public void onOpen( WebSocket conn, ClientHandshake handshake ) {
        System.out.println( "新的连接" );
        this.conn =conn;
    }

    @Override
    protected boolean onConnect(SelectionKey key) {
        System.out.println("0825 onConnect");
        return super.onConnect(key);
    }

    @Override
    public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
        System.out.println( "断开连接" );
    }

    @Override
    public void onMessage( WebSocket conn, String message ) {

        if(message.equals("40/scatter")){
            System.out.println("建立连接 40/scatter");
            return;
        }
        message = message.replace("42/scatter,", "");
        String type = getMessageType(message);
        String originData = getMessageData(message);
//        int length = 0;

        switch (type){
            case "pair":{
                System.out.println("进入处理方法 pair");
                doMessagePair(conn, originData);
                break;
            }
            case "api":{
                //解析出api指定的方法
                String apiType = getItem(originData, "type");
                switch (apiType){
                    case "getOrRequestIdentity":
                    case "identityFromPermissions":{
                        System.out.println("进入处理方法 identityFromPermissions");
                        IdentityFromPermissions(conn, originData);
                        break;
                    }
                    case "requestSignature":{
                        System.out.println("进入处理方法 requestSignature");
                        requestSignature(conn, originData);
                        break;
                    }
                }
                break;
            }
            default:{
                System.out.println("数据不合法！");
            }
        }
    }
    @Override
    public void onMessage( WebSocket conn, ByteBuffer message ) {
        System.out.println("收到客户端数据 : " + message );
    }

    @Override
    public void onError(WebSocket conn, Exception ex ) {
        ex.printStackTrace();
        if( conn != null ) {
        }
    }

    @Override
    public void onStart() {
        setConnectionLostTimeout(0);
        setConnectionLostTimeout(100);
    }

    private void doMessagePair(WebSocket conn, String originData){
        Gson gson = new Gson();
        Pair pair = gson.fromJson(originData, Pair.class);
        this.appkey = pair.getData().getAppkey();
        conn.send("42/scatter,[\"paired\",true]");
    }

    private void IdentityFromPermissions(WebSocket conn, String originData){
        System.out.println("[doMessageIdentityFromPermissions] originData: " + originData);
        //获取id
        String id = getItem(originData, "id");
        System.out.println("id: " + id);
        System.out.println("accountName: " + InjectionWebView.getAccountName());
        System.out.println("publicKey: " + InjectionWebView.getPublicKey());
        System.out.println("permission: " + InjectionWebView.getPermission());
        String resp = "42/scatter,[\"api\",{\"result\":{\"accounts\":[{\"authority\":\""+ InjectionWebView.getPermission() +"\",\"blockchain\":\"eos\",\"chainId\":\"ed8636abfe625d99fc9a759d49a016fd8dcae9193676a020aae2540c9fffe32f\",\"isHardware\":false,\"name\":\"" + InjectionWebView.getAccountName() + "\",\"publicKey\":\"" + InjectionWebView.getPublicKey() + "\"}],\"hash\":\"db4960659fb585600be9e0ec48d2e6f4826d6f929c4bcef095356ce51424608d\",\"kyc\":false,\"name\":\"Scatter Plugin\",\"publicKey\":\"" + InjectionWebView.getPublicKey() + "\"},\"id\":\"" + id  + "\"}]";
        System.out.println("[0805] resp: " + resp);
        conn.send(resp);
    }

    private void requestSignature(WebSocket conn, String originData){
        System.out.println("originData: " + originData);
        //获取id
        String id = getItem(originData, "id");
        //获取序列化数据
        String serializedTransaction = getItem(originData, "serializedTransaction");
        String chainId = getItem(originData, "chainId");
        String requiredKeys = getItem(originData, "requiredKeys");

        if(serializedTransaction.equals("")){
            //eosjs10版本兼容
            Gson gson = new Gson();
            signatureReqv1 signatureReq = gson.fromJson(originData, signatureReqv1.class);
            serializedTransaction = gson.toJson(signatureReq.getData().getPayload().getTransaction());
            chainId = signatureReq.getData().getPayload().getNetwork().getChainId();
            requiredKeys = "";
        }
        Map<String,Object> params=new HashMap<>();
        params.put("serializedTransaction",serializedTransaction);
        params.put("requiredKeys",requiredKeys);
        params.put("chainId",chainId);
        params.put("id",id);
        instance.fireGlobalEventCallback("reqSign", params);
    }

    private void doMessageApi(WebSocket conn, String originData){
    }

    private String getItem(String originData, String itemName){
        itemName = "\"" + itemName + "\":";
        int itemNameIndex = originData.indexOf(itemName);
        if(itemNameIndex < 0){
            return "";
        }
        int startIndex = itemNameIndex + itemName.length();
        String tempStr = originData.substring(startIndex);
        int endIndex = tempStr.indexOf(",") + startIndex;
        String itemStr = originData.substring(startIndex+1, endIndex-1);
        return itemStr;
    }

    private String getMessageType(String message){
        int typeStartIndex = message.indexOf("\"")+1;
        int typeEndIndex = message.indexOf(",")-1;
        String type = message.substring(typeStartIndex, typeEndIndex);
        return type;
    }

    private String getMessageData(String message){
        int dataStartIndex = message.indexOf("{");
        int dataEndIndex = message.lastIndexOf("}")+1;
        String originData = message.substring(dataStartIndex, dataEndIndex);
        return originData;
    }
}
