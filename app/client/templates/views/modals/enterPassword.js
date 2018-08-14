Template['views_modals_enterPassword'].events({
  submit: e => {
    e.preventDefault();
    const pw = $(e.target).find('.password')[0].value;
    const t = Template.instance();

    braveCheckPassword(pw, (err, matched) => {
      if (matched) {
        window.globalPw.set(pw);
        EthElements.Modal.hide();
      } else {
        t.errors.set(err);
      }
    });

    return;
  }
});

Template['views_modals_enterPassword'].onCreated(function() {
  this.errors = new ReactiveVar('');
});

Template['views_modals_enterPassword'].helpers({
  errors: () => {
    return Template.instance().errors.get();
  }
});
