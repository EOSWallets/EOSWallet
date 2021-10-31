package com.weex.app.extend.SocketObject.signatureReqV1;

public class Authorization {

    private String actor;
    private String permission;
    public void setActor(String actor) {
        this.actor = actor;
    }
    public String getActor() {
        return actor;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
    public String getPermission() {
        return permission;
    }

}
