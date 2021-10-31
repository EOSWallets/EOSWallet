package com.weex.app.extend.SocketObject.signatureReqV1;

import java.util.List;

public class Actions {
    @Override
    public String toString() {
        return "Actions{" +
                "account='" + account + '\'' +
                ", name='" + name + '\'' +
                ", authorization=" + authorization +
                ", data='" + data + '\'' +
                '}';
    }

    private String account;
    private String name;
    private List<Authorization> authorization;
    private String data;
    public void setAccount(String account) {
        this.account = account;
    }
    public String getAccount() {
        return account;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setAuthorization(List<Authorization> authorization) {
        this.authorization = authorization;
    }
    public List<Authorization> getAuthorization() {
        return authorization;
    }

    public void setData(String data) {
        this.data = data;
    }
    public String getData() {
        return data;
    }
}
