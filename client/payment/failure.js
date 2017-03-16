Template.failure.events = {
    "click .sign-up": function (e) {
        e.preventDefault();
        Modal.show('sign_up');
    },
    "click .sign-in": function (e) {
        e.preventDefault();
        Modal.show('sign_in');
    },
    "click .frgtpwd": function (e) {
        e.preventDefault();
        Modal.hide('sign_in');
        Modal.show('#forgotpwd');
    },
    "click .log_out_button": function (e) {
        e.preventDefault();
        console.log('logout');
        localStorage.removeItem('userId');
        Session.set('landing_user_profile_id', undefined);
        Session.clear('global_flag_free');
        window.location.reload(true);
    },
    "click #payment_unsuccess" : function(e) {
        e.preventDefault();
         var label;
        var category;
        if( (Session.get('post_payment_landing_page')) == 5 ){
            label = 'subscription';
            category = 'paid_subscription';
        }else if((Session.get('post_payment_landing_page')) == 2 || (Session.get('post_payment_landing_page')) == 3 ){
            label = 'course';
            category = 'Payment'
        }
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: 'Transaction failed',
            eventLabel: label,
            eventValue: Session.get('success_payment_value')
          });
            Router.go('/');
    } 
};

Template.failure.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (!data) {
            return true;
        }
    },
    login_user_name: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (data) {
            Meteor.call('webUserInfo', data, function (error, result) {
                console.log('webUserInfo', result);
                Session.set('login_check_name', result.name);
            });
            console.log('login_check', data);
            return Session.get('login_check_name');
        }
    }
});
