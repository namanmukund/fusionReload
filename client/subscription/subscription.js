Template.subs_breadcrumb.events = {
    "click .go_home_subscription" : function(e) {
        e.preventDefault();
        if(Session.get('landing_user_profile_id')){
            getSubsWall();
        }else{
            Router.go('/');
        }
        
    }
};

Template.subs_navigation.events = {
    "click .sign-up" : function(e) {
    e.preventDefault();
    Modal.show('sign_up');
    },
    "click .sign-in" : function(e) {
    e.preventDefault();
    Modal.show('sign_in');
    },
    "click .frgtpwd" : function(e) {
    e.preventDefault();
    Modal.hide('sign_in');
    Modal.show('#forgotpwd');
    },
    "click .log_out_button" : function(e) {
        e.preventDefault();
        localStorage.clear();
        Session.clear('landing_user_profile_id');
        Session.clear('global_flag_free');
        window.location.reload(true);
    }
};

Template.subscription.onCreated(function () {
    Blaze._allowJavascriptUrls();
    if(localStorage.getItem("userId")){
         Session.set('landing_user_profile_id',(localStorage.getItem("userId")));

    }
});

Template.subscription.onRendered(function () {
    Session.set('post_payment_landing_page',undefinded);
    $('document').ready(function(){
        $('.radio_button_subscription').on('click',function(){
            if($(this).is(':checked')){
                $('#total_price').val($(this).val());
                $('#notify1').val($(this).val());
                Session.setTemp('dicountamt',0);
            }
        })

        $('.radio_button_subscription').each(function(index,val){
            if($(this).hasClass('defaultSubscription')){
                $('#total_price').val($(this).val());
                $('#notify1').val($(this).val());
                Session.setTemp('dicountamt',0);
            }

        })
    });
});


Template.subs_navigation.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        if(!data){
            return true;
        }else{
            return false;
        }
    },
    login_user_name: function () {
        var userId = Session.get('landing_user_profile_id');
        if(userId){
                Meteor.call('webUserInfo',userId, function(error, result){
                        Session.set('login_check_name',result.name);
                });
            return Session.get('login_check_name');
        }
    }
});



Template.subs_body.rendered = function() {
        var userId = 40000480;
        var token = 'global';
//            subscriptionPlansWeb: function (userId, token) {
        Meteor.call('subscriptionPlansWeb',userId,token,function(error, result){
            Session.set('subscription_data',result);
        });
};

Template.subs_body.helpers({

    'subscription_val': function() {
        var data = Session.get('subscription_data');
        var data1 = JSON.parse(data.content);
        return data1.result_data.subscriptions[0].Validity;
    },
    'check_price': function(param1,param2) {
        if(param1>param2){
            return true
        }
    },
    'subs_id_value': function(param1,param2) {
        var data = Session.get('subscription_data');
        var data1 = JSON.parse(data.content);
        return data1.result_data.subscriptions[0].subscription_id;
    },
    'is_user_login_subscription': function() {
        if(!(Session.get('landing_user_profile_id'))){
            return true;
        }
    },
    'checked_button': function(param1,param2) {
        if(param1==param2){
            return true;
        }
    },
    'subscription_val_pricing': function() {
        if(Session.get('validityId_from_pricing_subscription')){
            return Session.get('validityId_from_pricing_subscription');
        }
    },
    'subscription_val_pricing_check': function(param1,param2) {
        if(param1==param2){
            return true;
        }
    },
    'final_payable_amount': function() {
        var total_amount = Session.get('total_amount');
        var payabale_amount = total_amount;
        var discount =0;
        if(total_amount){
        if(Session.get('discountamt_subs')){
         discount= parseFloat(Session.get('discountamt_subs'));
        }
        payabale_amount  = parseFloat(total_amount-discount);
        Session.set('payabale_amount',payabale_amount);
        }
        var price = {
            discount: discount,
            payabale_amount:payabale_amount
        }

        return price;

    }
//     'price_value': function() {
////         if( Session.get('validityPrice_from_pricing_subscription') ){
////             return Session.get('validityPrice_from_pricing_subscription');
////         }else{
////             return
////         }
//      return 1000;
//    },

});

Template.subs_body.events({
    "click .radio_button_subscription" : function(event, template) {
//        event.preventDefault();
           Session.set('discountamt_subs',0);
           Session.set('discountamt_subs',this.value);
           var caheckedvalof = $("input[name='radio']:checked").val();
           Session.set('total_amount',caheckedvalof);
           return true;
    },
    "click .apply_coupon_subscription" : function(event, template) {
        $('#mask1').show();
        toastr.clear();
        var couponCode = document.getElementById("get_coupon_value").value;
        if(couponCode.length==0 || couponCode==''){
                $('#mask1').hide();
                toastr.error('Please enter coupon code.');
            //  $('.offerprice').append('<p class ="coupon_status_message">Please enter coupon code.</ap>');
            return false;
        }
        var validity_id = $("input[type='radio']:checked").attr('id');
        var total_amount = parseFloat($("input[type='radio']:checked").val());
        Session.setTemp('total_amount',total_amount);
        var discount=0;
        Session.set('discountamt_subs',discount);
        var payable_amount =0;
        var token = 'global';
        var userId =Session.get('landing_user_profile_id');
        var type=0;
        var subscription_id = 1;
        var purchase_type = 'subscription';
        var is_express_checkout = 1;
        Meteor.call('coupon_code_validation',userId,couponCode,token,type,purchase_type,validity_id,is_express_checkout,subscription_id,function(error, result){
            var contentdata=JSON.parse(result.content);
            if(contentdata.status==true){
                    discount = parseFloat(contentdata.coupon_amount);
                    Session.set('discountamt_subs',discount);
                    payable_amount = total_amount - discount;

                    Session.set('total_payable_amount',parseFloat(payable_amount));
//                    $('.apply_coupon_subscription').hide();
                    // $('.offerprice').append('<p class ="coupon_status_message">'+contentdata.message+'</ap>');
                    $('#mask1').hide();
                    toastr.success(contentdata.message,'success');
            }else{
              $('#mask1').hide();
              toastr.warning(contentdata.message);
                // $('.offerprice').append('<p class ="coupon_status_message">'+contentdata.message+'</ap>');
            }
        });
        return ;
    },
        "click .remove_coupon_code":function(event,template){
        $("#get_coupon_value").val('');
         Session.set('discountamt_subs',0);
    },
    "click .subscription_proceed" : function(event, template) {
      $('#mask1').show();
//        var element = template.find('input:radio[name=radio]:checked');
        var element = $("input[type='radio']:checked").val();
//        var course = [{"courseId":"","packageType":"subscription","subscriptionId":$(element)[0].value,"validityId":$(element)[0].id,"renew":false}];
//        var userId = 40000480;
        var userId;
        if(Session.get('landing_user_profile_id')){
            userId = Session.get('landing_user_profile_id');
        }else{
            if((localStorage.getItem("userId"))){
                userId = (localStorage.getItem("userId"));
            }
        }

//        var payableAmount = $(element)[0].value;
            var payableAmount  = element;
        if(Session.get('total_payable_amount')){
            payableAmount = Session.get('total_payable_amount');
        }
        var merchant = 'payu';
        var is_express_checkout = 1;
        var validityId = $("input[type='radio']:checked").attr('id'); //$(element)[0].id;
//        var validityId = JSON.stringify(validityIdInt);
        var couponCode = "";
        couponCode = document.getElementById("get_coupon_value").value;
        var course_data =[];
        var renew = false ;
        var token = 'global';
        var currentDaysRemaining = 0;
        if(Session.get('subs_remaining_days')){
            currentDaysRemaining = parseInt(Session.get('subs_remaining_days'));
            renew=true;
        }
//        console.log('renew',renew);
//                        console.log('currentDaysRemaining',currentDaysRemaining);
        var course_arr = {
                          "courseId":"",
                          "packageType":"subscription",
                          "subscriptionId":"1",
                          "validityId":validityId,
                          "renew":renew,
                          "currentDaysRemaining":currentDaysRemaining
                      };

        course_data.push(course_arr);
        var course = JSON.stringify(course_data);
        ga('send', {
            hitType: 'event',
            eventCategory: 'Subscription',
            eventAction: 'paid_subscription',
            eventLabel: 'Proceed button clicked',
            eventValue:  validityId
          });
//        payment_subscription: function (payableAmount, merchant, is_express_checkout, userId, course, couponCode)
        if(userId){

            Meteor.call('payment_subscription',payableAmount,merchant, is_express_checkout, userId, course, couponCode,function(error, result){
                if(result!=false){
                var data = JSON.parse(result.content);
                Session.set('post_payment_landing_page',data.landing_page);
                    var surl = data.result_data.successUrl;
                    var furl = data.result_data.failureUrl;
                    var txnid = data.result_data.txnId;
                    var amount = data.result_data.amount;
                    Session.set('success_payment_value',amount);
                    var productinfo = 'Subscription';


                    var name = '';
                    var email = '';
                    var phone = '';
    //                'webUserInfo': function (userId)
                    Meteor.call('webUserInfo',userId, function(error, result){
                            name = result.name;
                            email = result.email;
                            if(result.phone){
                                var phone = result.phone;
                             }
                    });


    //                CryptoJS.SHA512("Message").toString()
    //                var hash = data.result_data.;

    //                 payU_payment: function (surl, furl , txnid, amount, productinfo, name, email, phone, hash) {

                    Meteor.call('payU_payment',surl, furl , txnid, amount, productinfo, name, email, phone, function(error, result){
                       
                        Session.set('payU_pay',result);
                        console.log('payU_pay',result.headers.location);
                        window.location.href=result.headers.location;
                         ga('send', {
                            hitType: 'event',
                            eventCategory: 'paid_subscription',
                            eventAction: 'payu_reached'
                          });
                    });
                }else{
                  $('#mask1').hide();
                    toastr.error('Not connecting to server');
                }
            });

        }
        else{
            Session.set('coming_from_subscription',1);
            Modal.show('sign_in');
        }
//        if(Session.get())
    }
});

function getSubsWall(){
    var url_string = Session.get('courseName');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData);
}
