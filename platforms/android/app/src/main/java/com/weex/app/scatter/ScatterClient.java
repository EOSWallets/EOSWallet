package com.weex.app.scatter;

import com.weex.app.scatter.models.requests.MsgTransaction.MsgTransactionRequestParams;
import com.weex.app.scatter.models.requests.Transaction.request.TransactionRequestParams;
import com.weex.app.scatter.models.response.ResponseCodeInfo;

public abstract class ScatterClient {

    public interface AppInfoReceived {
        void onAppInfoReceivedSuccessCallback(String appName, String appVersion);
        void onAccountReceivedErrorCallback(Error error);
    }

    public interface AccountReceived {
        void onAccountReceivedSuccessCallback(String accountName);
        void onAccountReceivedErrorCallback(Error error);
    }

    public interface TransactionCompleted {
        void onTransactionCompletedSuccessCallback(String[] signatures);
        void onTransactionCompletedErrorCallback(ResponseCodeInfo errorInfo, String messageToUser);
    }

    public interface MsgTransactionCompleted {
        void onMsgTransactionCompletedSuccessCallback(String signature);
        void onMsgTransactionCompletedErrorCallback(ResponseCodeInfo errorInfo, String messageToUser);
    }

    public void getAppInfo(AppInfoReceived onAppInfoReceived) {
    }

    public void getAccount(AccountReceived onAccountReceived) {
    }

    public void completeTransaction(TransactionRequestParams transactionRequestParams, TransactionCompleted onTransactionCompleted) {
    }

    public void completeMsgTransaction(MsgTransactionRequestParams data, MsgTransactionCompleted onMsgTransactionMsgCompleted) {
    }
}
