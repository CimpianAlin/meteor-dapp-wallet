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
  let pwHash = null;
  braveIpc.on('eth-wallet-password-hash', (e, hash) => {
    if (!hash) {
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
      pwHash = hash;
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
  });
  braveIpc.send('eth-wallet-get-password-hash');

  let lastCb = () => {};
  braveIpc.on('eth-wallet-compare-password-hash', (e, res) => {
    lastCb(res);
  });

  this.braveCheckPassword = (pw, cb) => {
    lastCb = res => {
      if (res) {
        cb(null, true);
      } else {
        cb('Incorrect password');
      }
    };
    braveIpc.send('eth-wallet-get-compare-password-hash', pw, pwHash);
  };

  this.braveStorePassword = (pw, cb) => {
    braveIpc.send('eth-wallet-store-password-hash', pw);
  };
};

Meteor.startup(() => {
  if (globalReady.get()) return;
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

braveIpc.on('eth-wallet-new-wallet', (e, address) => {
  EthAccounts.upsert(
    { address },
    {
      $set: {
        address,
        new: true,
        type: 'account',
        balance: '0'
      }
    }
  );
});

Session.setDefault('metamask', 'enabled');
braveIpc.on('eth-wallet-metamask-state', (e, state) => {
  Session.set('metamask', state);
});

braveIpc.send('eth-wallet-get-metamask-state');

Session.setDefault('keysPath', '');
braveIpc.on('eth-wallet-keys-path', (e, path) => {
  Session.set('keysPath', path);
});

braveIpc.send('eth-wallet-get-keys-path');
