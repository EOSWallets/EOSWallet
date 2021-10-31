package com.weex.app.extend.SocketObject;

public class GetInfoResp {
    private String server_version;
    private String chain_id;
    private long head_block_num;
    private long last_irreversible_block_num;
    private String last_irreversible_block_id;
    private String head_block_id;
    private String head_block_time;
    private String head_block_producer;
    private long virtual_block_cpu_limit;
    private long virtual_block_net_limit;
    private int block_cpu_limit;
    private long block_net_limit;
    private String server_version_string;
    private long fork_db_head_block_num;
    private String fork_db_head_block_id;
    private String server_full_version_string;
    public void setServer_version(String server_version) {
        this.server_version = server_version;
    }
    public String getServer_version() {
        return server_version;
    }

    public void setChain_id(String chain_id) {
        this.chain_id = chain_id;
    }
    public String getChain_id() {
        return chain_id;
    }

    public void setHead_block_num(long head_block_num) {
        this.head_block_num = head_block_num;
    }
    public long getHead_block_num() {
        return head_block_num;
    }

    public void setLast_irreversible_block_num(long last_irreversible_block_num) {
        this.last_irreversible_block_num = last_irreversible_block_num;
    }
    public long getLast_irreversible_block_num() {
        return last_irreversible_block_num;
    }

    public void setLast_irreversible_block_id(String last_irreversible_block_id) {
        this.last_irreversible_block_id = last_irreversible_block_id;
    }
    public String getLast_irreversible_block_id() {
        return last_irreversible_block_id;
    }

    public void setHead_block_id(String head_block_id) {
        this.head_block_id = head_block_id;
    }
    public String getHead_block_id() {
        return head_block_id;
    }

    public void setHead_block_time(String head_block_time) {
        this.head_block_time = head_block_time;
    }
    public String getHead_block_time() {
        return head_block_time;
    }

    public void setHead_block_producer(String head_block_producer) {
        this.head_block_producer = head_block_producer;
    }
    public String getHead_block_producer() {
        return head_block_producer;
    }

    public void setVirtual_block_cpu_limit(long virtual_block_cpu_limit) {
        this.virtual_block_cpu_limit = virtual_block_cpu_limit;
    }
    public long getVirtual_block_cpu_limit() {
        return virtual_block_cpu_limit;
    }

    public void setVirtual_block_net_limit(long virtual_block_net_limit) {
        this.virtual_block_net_limit = virtual_block_net_limit;
    }
    public long getVirtual_block_net_limit() {
        return virtual_block_net_limit;
    }

    public void setBlock_cpu_limit(int block_cpu_limit) {
        this.block_cpu_limit = block_cpu_limit;
    }
    public int getBlock_cpu_limit() {
        return block_cpu_limit;
    }

    public void setBlock_net_limit(long block_net_limit) {
        this.block_net_limit = block_net_limit;
    }
    public long getBlock_net_limit() {
        return block_net_limit;
    }

    public void setServer_version_string(String server_version_string) {
        this.server_version_string = server_version_string;
    }
    public String getServer_version_string() {
        return server_version_string;
    }

    public void setFork_db_head_block_num(long fork_db_head_block_num) {
        this.fork_db_head_block_num = fork_db_head_block_num;
    }
    public long getFork_db_head_block_num() {
        return fork_db_head_block_num;
    }

    public void setFork_db_head_block_id(String fork_db_head_block_id) {
        this.fork_db_head_block_id = fork_db_head_block_id;
    }
    public String getFork_db_head_block_id() {
        return fork_db_head_block_id;
    }

    public void setServer_full_version_string(String server_full_version_string) {
        this.server_full_version_string = server_full_version_string;
    }
    public String getServer_full_version_string() {
        return server_full_version_string;
    }

}