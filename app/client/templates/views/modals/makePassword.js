Template['views_modals_makePassword'].events({
  submit: e => {
    e.preventDefault();
    const pw = $(e.target).find('.password')[0].value;
    const pw2 = $(e.target).find('.passwordRepeat')[0].value;

    if (pw !== pw2) {
      Template.instance().errors.set("Your passwords don't match");
    } else {
      window.globalPw.set(pw);
      window.braveStorePassword(pw);
      braveIpc.send('eth-wallet-create-wallet', globalPw.get());
      EthElements.Modal.hide();
    }

    return;
  }
});

Template['views_modals_makePassword'].onCreated(function() {
  this.errors = new ReactiveVar('');
});

Template['views_modals_makePassword'].helpers({
  errors: () => {
    return Template.instance().errors.get();
  }
});
