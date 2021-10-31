package com.weex.app.extend.SocketObject;
import java.util.List;

public class ApiResp {

    public class Result {

        public class Accounts {
            private String authority;
            private String blockchain;
            private String chainId;
            private boolean isHardware;
            private String name;
            private String publicKey;
            public void setAuthority(String authority) {
                this.authority = authority;
            }
            public String getAuthority() {
                return authority;
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

            public void setIsHardware(boolean isHardware) {
                this.isHardware = isHardware;
            }
            public boolean getIsHardware() {
                return isHardware;
            }

            public void setName(String name) {
                this.name = name;
            }
            public String getName() {
                return name;
            }

            public void setPublicKey(String publicKey) {
                this.publicKey = publicKey;
            }
            public String getPublicKey() {
                return publicKey;
            }

        }

        private List<Accounts> accounts;
        private String hash;
        private boolean kyc;
        private String name;
        private String publicKey;
        public void setAccounts(List<Accounts> accounts) {
            this.accounts = accounts;
        }
        public List<Accounts> getAccounts() {
            return accounts;
        }

        public void setHash(String hash) {
            this.hash = hash;
        }
        public String getHash() {
            return hash;
        }

        public void setKyc(boolean kyc) {
            this.kyc = kyc;
        }
        public boolean getKyc() {
            return kyc;
        }

        public void setName(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }

        public void setPublicKey(String publicKey) {
            this.publicKey = publicKey;
        }
        public String getPublicKey() {
            return publicKey;
        }

    }

    private Result result;
    private String id;
    public void setResult(Result result) {
        this.result = result;
    }
    public Result getResult() {
        return result;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

}