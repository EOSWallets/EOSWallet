package com.weex.app.extend.SocketObject.signatureReqV1;

public class Data {

    private String type;
    private Payload payload;
    private String id;
    private String appkey;
    private String nonce;
    private String nextNonce;
    public void setType(String type) {
        this.type = type;
    }
    public String getType() {
        return type;
    }

    public void setPayload(Payload payload) {
        this.payload = payload;
    }
    public Payload getPayload() {
        return payload;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setAppkey(String appkey) {
        this.appkey = appkey;
    }
    public String getAppkey() {
        return appkey;
    }

    public void setNonce(String nonce) {
        this.nonce = nonce;
    }
    public String getNonce() {
        return nonce;
    }

    public void setNextNonce(String nextNonce) {
        this.nextNonce = nextNonce;
    }
    public String getNextNonce() {
        return nextNonce;
    }
}
