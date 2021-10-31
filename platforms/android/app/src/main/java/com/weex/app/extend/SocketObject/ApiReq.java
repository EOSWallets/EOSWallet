package com.weex.app.extend.SocketObject;

public class ApiReq {

    public class Data {

        public class Payload {
            private String origin;

            public void setOrigin(String origin) {
                this.origin = origin;
            }
            public String getOrigin() {
                return origin;
            }

        }

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