const MozillaVPNMessenger = {
  SERVERS_KEY: 'servers',

  _isolationKey: 7,

  async maybeInitPort() {
    if (this.port && this.port.error === null) {
      this.postToApp('status');
      this.postToApp('servers');
      return;
    }
    try {
      this.port = await browser.runtime.connectNative('mozillavpn');
      this.port.onMessage.addListener(
          response => this.handleResponse(response));

      this.port.onMessage.addListener(this.handleResponse);
      this.postToApp('status');
      this.postToApp('servers');

      // When the mozillavpn dies or the VPN disconnects, we need to increase
      // the isolation key in order to create new proxy connections. Otherwise
      // we could see random timeout when the browser tries to connect to an
      // invalid proxy connection.
      this.port.onDisconnect.addListener(() => this.increaseIsolationKey());

    } catch (e) {
      this._connected = false;
    }

    this.postToApp('status');
    this.postToApp('servers');
  },
  async init() {
    const {servers} = await browser.storage.local.get('servers');
    if (typeof (servers) === 'undefined') {
      await browser.storage.local.set({[MozillaVPNMessenger.SERVERS_KEY]: []});
    }
    this.maybeInitPort();
  },

  // Post messages to MozillaVPN client
  postToApp(message) {
    try {
      this.port.postMessage({t: message});
    } catch (e) {
      console.log(e, 'error')
    }
  },

  async getConnectionStatus() {
    return this._status;
  },

  async handleResponse(response) {
    console.log(response)
    if (response.servers) {
      const servers = response.servers.countries;
      browser.storage.local.set({[MozillaVPNMessenger.SERVERS_KEY]: servers});
      return;
    }

    if ((response.status && response.status.vpn) || response.t === 'status') {
      await browser.storage.local.set({'status': response.status});

      // Let's increase the network key isolation at any vpn status change.
      MozillaVPNMessenger.increaseIsolationKey();
    }
  },

  increaseIsolationKey() {
    ++this._isolationKey;
  },
};

const RequestListener = {

  init() {
    /*

    Listen for requests and proxy as needed. IRL, "<all_urls>"
    could be changed IRL to the list of sites with special proxy configurations

    */

    browser.proxy.onRequest.addListener(
        this.requestListener, {urls: ['<all_urls>']});
  },

  async requestListener(req) {
    if (req.tabId == -1) {
      console.log('No shirt, no tabId, no thank you')
      return {};
    }
    // console.log(req)

    // format originUrl
    const {originUrl} = req;
    const formattedOriginHostname = new URL(originUrl).hostname;
    // console.log(formattedOriginHostname);

    // return

    // // get proxy address for site
    const siteProxyConfig =
        await EspecialProxies.getProxyForOrigin(formattedOriginHostname);

    // Proxy DNS if possible (only possible for SOCKS proxies)
    if (['socks', 'socks4'].includes(siteProxyConfig.proxy.type)) {
      siteProxyConfig.proxy.proxyDNS = true;
    }

    console.log(siteProxyConfig, 'siteProxyConfig');

    // Do the damn thing
    return [{
      ...siteProxyConfig.proxy,
      connectionIsolationKey: '' + MozillaVPNMessenger._isolationKey
    }];
  },

};

const EspecialProxies = {
  _especiallyProxiedSiteList: [],

  async setProxyForOrigin() {

  },

  formatOrigin() {

  },

  async getEspeciallyProxiedOriginList() {
    const originList = await browser.storage.local.get('proxiedOrigins');

    if (!originList || !originList['proxiedOrigins']) {
      return null;
    }

    return originList['proxiedOrigins'];
  },

  async getProxyForOrigin(origin) {
    const proxyList = await this.getEspeciallyProxiedOriginList();
    if (!proxyList) {
      return null;
    }

    return proxyList.find(o => origin === origin);
  },

};

MozillaVPNMessenger.init();
RequestListener.init();
// EspecialProxies.init();

setInterval(() => {
  MozillaVPNMessenger.postToApp({t: 'servers'});
}, 10000);