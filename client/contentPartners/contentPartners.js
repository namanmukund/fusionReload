Template.content_partner.onCreated(function () {
    Blaze._allowJavascriptUrls();
});

Template.content_partner_list.events({
    'click #pop_up_enquire': function () {
	Modal.show('content_enquirepop');
    }
});

Template.content_enquirepop.events({
    'click #pop_up_enquire': function () {
	Modal.show('content_enquirepop');
    },
    'click #conSubmit':function(e){
        e.preventDefault();
        var conName = $('#conName').val();
        var conEmail = $('#conEmail').val();
        var conMobile = $('#conMobile').val();
        var bestTimeToCall = $('#bestTimeToCall').val();
	var conCourse = $('#conCourse').val();
	var conContent = [];
	$("input[name='conOption[]']:checked").each(function(){conContent.push($(this).val());});
        Meteor.call('contentPartnerWeb', conName,conCourse,conContent,conEmail,conMobile,bestTimeToCall, function (error, result) {
	    alert(result.message);
	    if(result.status){
		location.assign("/content_partner");
	    }
        });
    }
});