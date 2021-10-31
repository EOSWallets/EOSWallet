package com.weex.app.extend.SocketObject.signatureReqV1;

import java.util.List;

public class Transaction {
    @Override
    public String toString() {
        return "{" +
                "expiration='" + expiration + '\'' +
                ", ref_block_num=" + ref_block_num +
                ", ref_block_prefix=" + ref_block_prefix +
                ", max_net_usage_words=" + max_net_usage_words +
                ", max_cpu_usage_ms=" + max_cpu_usage_ms +
                ", delay_sec=" + delay_sec +
                ", context_free_actions=" + context_free_actions +
                ", actions=" + actions +
                ", transaction_extensions=" + transaction_extensions +
                '}';
    }

    private String expiration;
    private int ref_block_num;
    private long ref_block_prefix;
    private int max_net_usage_words;
    private int max_cpu_usage_ms;
    private int delay_sec;
    private List<String> context_free_actions;
    private List<Actions> actions;
    private List<String> transaction_extensions;
    public void setExpiration(String expiration) {
        this.expiration = expiration;
    }
    public String getExpiration() {
        return expiration;
    }

    public void setRef_block_num(int ref_block_num) {
        this.ref_block_num = ref_block_num;
    }
    public int getRef_block_num() {
        return ref_block_num;
    }

    public void setRef_block_prefix(long ref_block_prefix) {
        this.ref_block_prefix = ref_block_prefix;
    }
    public long getRef_block_prefix() {
        return ref_block_prefix;
    }

    public void setMax_net_usage_words(int max_net_usage_words) {
        this.max_net_usage_words = max_net_usage_words;
    }
    public int getMax_net_usage_words() {
        return max_net_usage_words;
    }

    public void setMax_cpu_usage_ms(int max_cpu_usage_ms) {
        this.max_cpu_usage_ms = max_cpu_usage_ms;
    }
    public int getMax_cpu_usage_ms() {
        return max_cpu_usage_ms;
    }

    public void setDelay_sec(int delay_sec) {
        this.delay_sec = delay_sec;
    }
    public int getDelay_sec() {
        return delay_sec;
    }

    public void setContext_free_actions(List<String> context_free_actions) {
        this.context_free_actions = context_free_actions;
    }
    public List<String> getContext_free_actions() {
        return context_free_actions;
    }

    public void setActions(List<Actions> actions) {
        this.actions = actions;
    }
    public List<Actions> getActions() {
        return actions;
    }

    public void setTransaction_extensions(List<String> transaction_extensions) {
        this.transaction_extensions = transaction_extensions;
    }
    public List<String> getTransaction_extensions() {
        return transaction_extensions;
    }

}
