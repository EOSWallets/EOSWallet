package com.weex.app.extend.SocketObject;

import java.util.List;

public class GetBlockResp {

    private String timestamp;
    private String producer;
    private int confirmed;
    private String previous;
    private String transaction_mroot;
    private String action_mroot;
    private int schedule_version;
    private String new_producers;
    private String producer_signature;
    private List<String> transactions;
    private String id;
    private long block_num;
    private long ref_block_prefix;
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    public String getTimestamp() {
        return timestamp;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }
    public String getProducer() {
        return producer;
    }

    public void setConfirmed(int confirmed) {
        this.confirmed = confirmed;
    }
    public int getConfirmed() {
        return confirmed;
    }

    public void setPrevious(String previous) {
        this.previous = previous;
    }
    public String getPrevious() {
        return previous;
    }

    public void setTransaction_mroot(String transaction_mroot) {
        this.transaction_mroot = transaction_mroot;
    }
    public String getTransaction_mroot() {
        return transaction_mroot;
    }

    public void setAction_mroot(String action_mroot) {
        this.action_mroot = action_mroot;
    }
    public String getAction_mroot() {
        return action_mroot;
    }

    public void setSchedule_version(int schedule_version) {
        this.schedule_version = schedule_version;
    }
    public int getSchedule_version() {
        return schedule_version;
    }

    public void setNew_producers(String new_producers) {
        this.new_producers = new_producers;
    }
    public String getNew_producers() {
        return new_producers;
    }

    public void setProducer_signature(String producer_signature) {
        this.producer_signature = producer_signature;
    }
    public String getProducer_signature() {
        return producer_signature;
    }

    public void setTransactions(List<String> transactions) {
        this.transactions = transactions;
    }
    public List<String> getTransactions() {
        return transactions;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setBlock_num(long block_num) {
        this.block_num = block_num;
    }
    public long getBlock_num() {
        return block_num;
    }

    public void setRef_block_prefix(long ref_block_prefix) {
        this.ref_block_prefix = ref_block_prefix;
    }
    public long getRef_block_prefix() {
        return ref_block_prefix;
    }

}