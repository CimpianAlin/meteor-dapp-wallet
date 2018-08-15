Template['brave_payments_notice'].events({
  'click button': function(e) {
    braveIpc.send('eth-wallet-enable-brave-payments');

    // wait until the bat address becomes available
    Tracker.autorun(c => {
      if (!window.batAddress.get()) return;
      c.stop();
      FlowRouter.go(
        FlowRouter.path('sendToBrave', { address: window.batAddress.get() })
      );
    });
  }
});
