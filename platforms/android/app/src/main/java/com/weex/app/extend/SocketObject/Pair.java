package com.weex.app.extend.SocketObject;

public class Pair {

    public class Data {
        private String appkey;
            private String origin;
            private boolean passthrough;
            public void setAppkey(String appkey) {
                this.appkey = appkey;
            }
            public String getAppkey() {
                return appkey;
            }

            public void setOrigin(String origin) {
                this.origin = origin;
            }
            public String getOrigin() {
                return origin;
            }

            public void setPassthrough(boolean passthrough) {
                this.passthrough = passthrough;
            }
            public boolean getPassthrough() {
                return passthrough;
            }
            @Override
            public String toString() {
                return "Data{" +
                        "appkey='" + appkey + '\'' +
                        ", origin='" + origin + '\'' +
                        ", passthrough=" + passthrough +
                        '}';
            }
    }

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
    @Override
    public String toString() {
        return "Pair{" +
                "data=" + data +
                ", plugin='" + plugin + '\'' +
                ", device='" + device + '\'' +
                ", uuid='" + uuid + '\'' +
                '}';
    }
}