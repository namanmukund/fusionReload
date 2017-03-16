Template.content_partner.onCreated(function () {
    Blaze._allowJavascriptUrls();
});

Template.content_partner_list.events({
    'click #pop_up_enquire': function () {
		Modal.show('content_enquirepop');
    }
});