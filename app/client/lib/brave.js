Meteor.startup(function() {
  Tracker.autorun(function() {
    // If on ropsten, add the testnet BAT token, only once.
    if (!localStorage['dapp_hasBAT'] && Session.get('network') === 'ropsten') {
      localStorage.setItem('dapp_hasBAT', true);

      // wait 5s, to allow the tokens to be loaded from the localstorage first
      Meteor.setTimeout(function() {
        const batToken = '0x60b10c134088ebd63f80766874e2cade05fc987b';
        const tokenId = Helpers.makeId('token', batToken);
        Tokens.upsert(tokenId, {
          $set: {
            address: batToken,
            name: 'BAT Ropsten',
            symbol: 'BATr',
            balances: {},
            decimals: 18
          }
        });
      }, 5000);

      // If on main net, add the BAT token, only once.
    } else if (
      !localStorage['dapp_hasBAT'] &&
      Session.get('network') === 'main'
    ) {
      localStorage.setItem('dapp_hasBAT', true);

      // wait 5s, to allow the tokens to be loaded from the localstorage first
      Meteor.setTimeout(function() {
        const batToken = '0x0D8775F648430679A709E98d2b0Cb6250d2887EF';
        const tokenId = Helpers.makeId('token', batToken);
        Tokens.upsert(tokenId, {
          $set: {
            address: batToken,
            name: 'Basic Attention Token',
            symbol: 'BAT',
            balances: {},
            decimals: 18
          }
        });
      }, 5000);
    }
  });
});

braveIpc = {
  on: (...args) => {
    if (window.chrome && window.chrome.ipcRenderer)
      window.chrome.ipcRenderer.on(...args);
  },
  send: (...args) => {
    if (window.chrome && window.chrome.ipcRenderer)
      window.chrome.ipcRenderer.send(...args);
  }
};

window.globalPw = new ReactiveVar();
bravePasswordFlow = () => {
  web3.eth.getAccounts((err, accounts) => {
    if (accounts.length === 0) {
      EthElements.Modal.question(
        {
          template: 'views_modals_makePassword',
          ok: false,
          cancel: false
        },
        {
          closeable: false
        }
      );
    } else {
      EthElements.Modal.question(
        {
          template: 'views_modals_enterPassword',
          ok: false,
          cancel: false
        },
        {
          closeable: false
        }
      );
    }

    let lastCb = () => {};
    braveIpc.on('eth-wallet-unlock-account-result', (e, result) => {
      const res = JSON.parse(result);
      if (res.error) lastCb(res.error);
      else lastCb(null, true);
    });

    this.braveCheckPassword = (pw, cb) => {
      lastCb = cb;
      braveIpc.send('eth-wallet-unlock-account', accounts[0], pw);
    };
  });
};

Meteor.startup(() => {
  EthElements.Modal.question(
    {
      template: 'views_modals_loading2',
      ok: false,
      cancel: false
    },
    {
      closeable: false
    }
  );
});
