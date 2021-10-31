package com.weex.app.extend.SocketObject.signatureReqV1;

public class Payload {

    private Transaction transaction;
    private Buf buf;
    private String blockchain;
    private Network network;
    private RequiredFields requiredFields;
    private String origin;
    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
    public Transaction getTransaction() {
        return transaction;
    }

    public void setBuf(Buf buf) {
        this.buf = buf;
    }
    public Buf getBuf() {
        return buf;
    }

    public void setBlockchain(String blockchain) {
        this.blockchain = blockchain;
    }
    public String getBlockchain() {
        return blockchain;
    }

    public void setNetwork(Network network) {
        this.network = network;
    }
    public Network getNetwork() {
        return network;
    }

    public void setRequiredFields(RequiredFields requiredFields) {
        this.requiredFields = requiredFields;
    }
    public RequiredFields getRequiredFields() {
        return requiredFields;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
    public String getOrigin() {
        return origin;
    }


}
