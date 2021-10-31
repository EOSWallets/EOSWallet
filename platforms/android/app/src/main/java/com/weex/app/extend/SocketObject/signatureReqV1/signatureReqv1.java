package com.weex.app.extend.SocketObject.signatureReqV1;

public class signatureReqv1 {

    private Data data;
    private String plugin;
    private String device;
    private String uuid;
    public void setData(Data data) {
        this.data = data;
    }
    public Data getData() {
        return data;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }
    public String getPlugin() {
        return plugin;
    }

    public void setDevice(String device) {
        this.device = device;
    }
    public String getDevice() {
        return device;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    public String getUuid() {
        return uuid;
    }
}

