package com.weex.app.extend.SocketObject.signatureReqV1;

import java.util.List;

public class Buf {

    private String type;
    private List<Integer> data;
    public void setType(String type) {
        this.type = type;
    }
    public String getType() {
        return type;
    }

    public void setData(List<Integer> data) {
        this.data = data;
    }
    public List<Integer> getData() {
        return data;
    }

}
