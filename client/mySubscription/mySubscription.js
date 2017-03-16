Template.mysubscription.helpers({
    'subscriptionRemainingDays': function () {
        return Session.get('subscriptionRemainingDays');
    },
    'subscriptionValidityId': function () {
        return Session.get('subscriptionValidityId');
    }
});


Template.monthssubscription.helpers({
    'subscriptionRemainingDays': function () {
        return Session.get('subscriptionRemainingDays');
    },
    'subscriptionValidityId': function () {
        return Session.get('subscriptionValidityId');
    }
});




Template.subscriptionExpired.helpers({
    'subscriberName': function () {
        return Session.get("subscriberName");
    }
});

Template.iprofsubscriptionStart.events({
	'click .clickSubscribeNow': function(event){
        event.preventDefault();
        Modal.hide("iprofsubscription");
        Router.go('/subscription/plan');
       }

});


Template.iprofsubscription.events({
	'click .clickSubscribeNow': function(event){
        event.preventDefault();
        Modal.hide("iprofsubscription");
        Router.go('/subscription/plan');
        
       }

});


Template.mysubscription.events({
	'click .clickSubscribeNow': function(event){
        event.preventDefault();
        Modal.hide("mysubscription");
        Router.go('/subscription/plan');
        
       }

});


Template.monthssubscription.events({
	'click .clickSubscribeNow': function(event){
        event.preventDefault();
        Modal.hide("monthssubscription");
        Router.go('/subscription/plan');
        
       }

});



Template.subscriptionExpired.events({
	'click .clickSubscribeNow': function(event){
        event.preventDefault();
        Modal.hide("subscriptionExpired");
        Router.go('/subscription/plan');
        
       }

});

