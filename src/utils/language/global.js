   
var langFiles = {
    en:require("./en.js").zhLan,
    zh:require("./zh.js").zhLan
}
    exports.lang = function(key,lan) {
        if (lan == "en-US") {
            return langFiles.en[key] || "not find";
        }
        if (lan == "zh-CN") {
            return langFiles.zh[key] || "not find";
        }
        return lan;
    }
