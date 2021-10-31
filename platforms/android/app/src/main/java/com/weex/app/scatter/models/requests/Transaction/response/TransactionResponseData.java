package com.weex.app.scatter.models.requests.Transaction.response;

public class TransactionResponseData {
    private SignData signData;

    public TransactionResponseData(SignData signData) {
        this.signData = signData;
    }

    public SignData getSignData() {
        return signData;
    }

    @Override
    public String toString() {
        return "TransactionResponseData{" +
                "signData=" + signData +
                '}';
    }
}
