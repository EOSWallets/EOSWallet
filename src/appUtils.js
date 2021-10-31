exports.getUrl = function (url) {
    let bundleUrl = new String(weex.config.bundleUrl)
    console.log('bundleUrl: ', bundleUrl)
    const isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0
    const isIOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('sign-app') > 0
    let nativeBase
    if (isAndroidAssets) {
      nativeBase = 'file://assets/dist/' + url
    } else if (isIOSAssets) {
      nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1) + url
    } else {
      let host = 'localhost:8081'
      const matches = /\/\/([^\/]+?)\//.exec(bundleUrl)
      if (matches && matches.length >= 2) {
        host = matches[1]
      }
  
      if (typeof window === 'object') {
        nativeBase = 'http://' + host + '/'
      } else {
        nativeBase = 'http://' + host + '/'
      }
      nativeBase = nativeBase + url + '.html'
    }
    return nativeBase
}