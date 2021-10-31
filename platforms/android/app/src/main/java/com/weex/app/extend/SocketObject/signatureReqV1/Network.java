package com.weex.app.extend.SocketObject.signatureReqV1;

public class Network {

    private String name;
    private String protocol;
    private String host;
    private int port;
    private String blockchain;
    private String chainId;
    private String token;
    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
    public String getProtocol() {
        return protocol;
    }

    public void setHost(String host) {
        this.host = host;
    }
    public String getHost() {
        return host;
    }

    public void setPort(int port) {
        this.port = port;
    }
    public int getPort() {
        return port;
    }

    public void setBlockchain(String blockchain) {
        this.blockchain = blockchain;
    }
    public String getBlockchain() {
        return blockchain;
    }

    public void setChainId(String chainId) {
        this.chainId = chainId;
    }
    public String getChainId() {
        return chainId;
    }

    public void setToken(String token) {
        this.token = token;
    }
    public String getToken() {
        return token;
    }

}
