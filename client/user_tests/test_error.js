Template.test_error.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Template.test_error.rendered = function() {
    Session.set('error_msg','Error occured. due to insufficient details.');
}

Template.test_error.helpers({
    'errorMsg':function(){
        return Session.get('error_msg');
    },
});