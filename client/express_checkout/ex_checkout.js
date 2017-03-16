/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Template.ex_cart_user_profile_data.helpers({
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

Template.navigation.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (!data) {
            return true;
        } else {
            return false;
        }
    }
});

Template.ex_cart_list.onRendered(function () {

    Session.set('express_discountamt', 0);
    var data = Session.get('express_checkout_data');
    console.log(data);
    console.log('my data');
});


Template.ex_cart_list.helpers({
    cartList: function () {
        if (Session.get('express_checkout_data')) {
            var data = Session.get('express_checkout_data');
            if (data) {
                return data;
            }
        }
    },
    cartCount: function () {
        if (Session.get('express_checkout_data')) {
            return 1;
        }
    },
    cartTotal: function () {
        if (Session.get('express_checkout_data')) {
            var data = Session.get('express_checkout_data');
            var total = 0;

            if (data.discountedPrice > 0) {
                total = parseFloat(data.discountedPrice);
            } else {
                total = parseFloat(data.price);
            }

            total = total.toFixed(2);
            Session.set('ex_cartTotalAmt', total);
            return total;
        }
    },
    totalPayable: function () {
        var discount = 0;
        var cartTotal = Session.get('ex_cartTotalAmt');
        if (cartTotal) {
            if (Session.get('express_discountamt')) {
                var discountamt = Session.get('express_discountamt');
                discount = parseFloat(discountamt);
            }
            var calamt = parseFloat(cartTotal) - parseFloat(discount);
            Session.set('extotalFinalPayable', calamt.toFixed(2));
            Session.set('totalFinalPayable', calamt.toFixed(2));
            return calamt.toFixed(2);
        } else {
            return 0;
        }

    },
    cartdiscount: function () {
        if (Session.get('express_discountamt')) {
            var discountamt = Session.get('express_discountamt');
            discount = parseFloat(discountamt);
            return discount;
        } else {
            return 0;
        }
    },
    isDiscounted: function () {
        if (Session.get('express_checkout_data')) {
            var data = Session.get('express_checkout_data');
            if (parseInt(data.discountedPrice) > 0) {
                return true;
            }
            return false;
        }
    }
});


Template.ex_cart_user_shipping_billing_address.onRendered(function () {
    $('#billingform').validate({
        rules: {
            billing_fname: {
                required: true,
            },
            billing_address: {
                required: true,
            },
            billing_locality: {
                required: true,
            },
            billing_city: {
                required: true,
            },
            billing_state: {
                required: true,
            },
            billing_zip: {
                required: true,
                digits: true,
                rangelength: [6, 6]
            },
            billing_mob_no: {
                digits: true,
                rangelength: [10, 10]
            }
        },
        messages: {
            billing_fname: {
                required: "You must enter your full name.",
            },
            billing_address: {
                required: "You must enter your address name.",
            },
            billing_locality: {
                required: "You must enter your locality.",
            },
            billing_city: {
                required: "You must enter your city name.",
            },
            billing_state: {
                required: "You must select city.",
            },
            billing_zip: {
                required: "You must enter your full name.",
                minlength: "Zip code must be at least 6 digits."
            },
            billing_mob_no: {
                digits: "You must enter digits only",
                rangelength: "Your mobile should have 10 characters."
            }
        }
    });
    $('#shippingform').validate({
        rules: {
            ship_fname: {
                required: true,
            },
            ship_address: {
                required: true,
            },
            ship_locality: {
                required: true,
            },
            ship_city: {
                required: true,
            },
            ship_state: {
                required: true,
            },
            ship_zip: {
                required: true,
                digits: true,
                rangelength: [6, 6]
            },
            ship_mob_no: {
                digits: true,
                rangelength: [10, 10]
            }
        },
        messages: {
            ship_fname: {
                required: "You must enter your full name.",
            },
            ship_address: {
                required: "You must enter your address name.",
            },
            ship_locality: {
                required: "You must enter your locality.",
            },
            ship_city: {
                required: "You must enter your city name.",
            },
            ship_state: {
                required: "You must select states.",
            },
            ship_zip: {
                required: "You must enter your full name.",
                minlength: "Zip code must be at least 6 digits."
            },
            ship_mob_no: {
                digits: "You must enter digits only",
                rangelength: "Your mobile should have 10 characters."
            }
        }
    });
});

Template.ex_cart_user_shipping_billing_address.events = {
    // "click #billingform input": function (event,template) {
    // 	if($("#inlineCheckbox12").prop("checked")==true){
    // 		$("#inlineCheckbox12").prop("checked",false);
    // 		$("#shippingform input").each(function(i){
    //    	 			$(this).attr("readonly",false);
    //    	 		});
    //    	 	$("textarea[name='ship_address']").attr("readonly",false);
    // 	}
    // 	return true;
    // },
    "click #backbtn": function (event, template) {
        $('#address').hide();
        $('#cartlisting').show();
    },
    "click #inlineCheckbox12": function (event, template) {
        if ($("#inlineCheckbox12").prop("checked") == true) {
            $("input[name='ship_fname']").val($("input[name='billing_fname']").val());
            $("textarea[name='ship_address']").val($("textarea[name='billing_address']").val());
            $("input[name='ship_locality']").val($("input[name='billing_locality']").val());
            $("input[name='ship_city']").val($("input[name='billing_city']").val());
            $("select[name='ship_state']").val($("select[name='billing_state']").val());
            $("input[name='ship_mob_no']").val($("input[name='billing_mob_no']").val());
            $("input[name='ship_zip']").val($("input[name='billing_zip']").val());
            $("#shippingform input").each(function (i) {
                $(this).attr("readonly", true);
            });
            $("textarea[name='ship_address']").attr("readonly", true);
            $("select[name='ship_state']").attr("readonly", true);
        } else {
            $("#shippingform input").each(function (i) {
                $(this).attr("readonly", false);
                $(this).val("");
            });
            $("textarea[name='ship_address']").attr("readonly", false);
            $("textarea[name='ship_address']").val("");
            $("select[name='ship_state']").val('');
            $("select[name='ship_state']").attr("readonly", false);
        }
        return true;
    },
    "keyup  #billingform": function (event, template) {
        $("#inlineCheckbox12").prop("checked", false);
        $("#shippingform")[0].reset();
    },
    // "click #inlineCheckbox13": function (event,template) {
    // 	 	if($("#inlineCheckbox13").prop("checked")==false){
    // 	 		alert('dont begin_save');
    // 	 		$(".proceedbtn").prop("disabled",true);
    // 	 		return true;
    // 	 	}else{
    // 	 		alert('begin_save');
    // 	 		alert($("#inlineCheckbox12").prop("checked"));
    // 	 		$(".proceedbtn").prop("disabled",false);
    // 	 		var shippingstateId 	= 	$("select[name='ship_state']").val();
    // 	 		alert('ship'+shippingstateId);
    // 	 		var billingStateId 	=	$("select[name='billing_state']").val();
    // 	 		alert('bill'+billingStateId);
    // 	 	}
    // 	 	return true;
    //    },
    "click #saveAddressBtn": function (event, template) {
        event.preventDefault();
        toastr.clear();
        var newshipName = $("input[name='ship_fname']").val();
        var newshipAddress = $("textarea[name='ship_address']").val();
        var newshipLocality = $("input[name='ship_locality']").val();
        var newshipCity = $("input[name='ship_city']").val();
        var newshipState = $("select[name='ship_state']").val();
        var newshipMob_no = $("input[name='ship_mob_no']").val();
        var newshipZip = $("input[name='ship_zip']").val();
        var newStateName = $("select[name='ship_state'] :selected").text();

        if (newshipName == '') {
            toastr.error('Please enter your name');
            return false;
        } else if (newshipAddress == '') {
            toastr.error('Shipping address cant be blank');
            return false;
        } else if (newshipCity == '') {
            toastr.error('City name cant be blank');
            return false;
        } else if (newshipState == '') {
            toastr.error('please select state');
            return false;
        } else if (newshipMob_no == '') {
            toastr.error('Please enter mobile no');
            return false;
        }

        $(".proceedbtn").prop("disabled", false);
        $("#editableaddress").hide();
        $("#userAddress").show();
        $("#finalpayment").show();
        $("#backbtn").show();
        $("#changeNewAddressbtn").show();
        $(".codnow").show();
        toastr.info('Your address saved successfully.', 'Success');
        $("#newUserAddress").html(newshipName + '<br />' + newshipAddress + ',' + newshipLocality + ',' + newshipCity + '<br />' + newStateName + '<br />Pin code:-' + newshipZip + '<br />Mobile No: ' + newshipMob_no);
        return true;
    },
    "click #changeNewAddressbtn": function (event, template) {
        event.preventDefault();
        $("#finalpayment").hide();
        $(".proceedbtn").prop("disabled", false);
        $("#editableaddress").show();
        $("#userAddress").hide();
        $("#finalpayment").hide();
        $("#backbtn").show();
        $("#changeNewAddressbtn").hide();
        $(".codnow").hide();
        return true;
    }
};


Template.ex_cart_list.events = {
    "click .apply_coupon_subscription": function (event, template) {
        // 	$("#get_coupon_value").val($("#offercode").val());
        toastr.clear();
        var couponCode = $("#get_coupon_value").val();
        $('.coupon_status_message').remove();
        if (couponCode.length == 0) {
            toastr.error('Please enter coupon code.');
            //  $('.offerprice').append('<p class ="coupon_status_message">Please enter coupon code.</ap>');
            return false;
        }
        $('#mask1').show();
        var token = 'global';
        var userId = Session.get('landing_user_profile_id');
        var type = 0;
        var is_express_checkout=1;
        var cartData = Session.get('express_checkout_data');
//        var course_arr = {
//            "chapterId": "",
//            "courseId": cartData.packageId,
//            "packageType": cartData.package_type,
//            "subscriptionId": cartData.packageSubscriptionId,
//            "currentDaysRemaining": 0,
//            "renew": false
//        };
//coupon_code_validation_exp_chkout: function (userId,coupon,token,type, is_express_checkout, packageSubscriptionId, packageId) {
        Meteor.call('coupon_code_validation_exp_chkout', userId, couponCode, token, type, is_express_checkout, cartData.packageSubscriptionId, cartData.packageId, function (error, result) {
            var contentdata = JSON.parse(result.content);
            if (contentdata.status == true) {
                $('#mask1').hide();
                var discount = contentdata.coupon_amount;
                Session.set('express_discountamt', discount);
                $('.apply_coupon_subscription').hide();
                // $('.offerprice').append('<p class ="coupon_status_message">'+contentdata.message+'</ap>');
                toastr.success(contentdata.message, 'success');
            } else {
                $('#mask1').hide();
                toastr.warning(contentdata.message);
                // $('.offerprice').append('<p class ="coupon_status_message">'+contentdata.message+'</ap>');
            }
        });
        return;
    },
    "click .remove_coupon_code": function (event, template) {
        $("#get_coupon_value").val('');
        Session.set('express_discountamt', 0);
        $('.apply_coupon_subscription').show();
        $('.coupon_status_message').remove();
    },
    "click #get_coupon_value": function (event, template) {
        Session.set('express_discountamt', 0);
        $('.apply_coupon_subscription').show();
        $('.coupon_status_message').remove();
    },
    "click #nextbtn": function (event, template) {
        $('#cartlisting').hide();
        $('#address').show();

    },
    "click #finalpayment": function (event, template) {
        event.preventDefault();
        $('#mask1').show();
        // alert('zskjdfhjk');
        var cartData = Session.get('express_checkout_data');
        var course_data = [];
        // $.each(cartData, function (index, value) {
        var course_arr = {
            "chapterId": "",
            "courseId": cartData.packageId,
            "packageType": cartData.package_type,
            "subscriptionId": cartData.packageSubscriptionId,
            "currentDaysRemaining": 0,
            "renew": false
        };
        course_data.push(course_arr);
        // });

        var payableAmount = Session.get('extotalFinalPayable');
        var merchant = 'payu';
        var is_express_checkout = 1;
        var userId = parseInt(Session.get('landing_user_profile_id'));
        var couponCode = $("#get_coupon_value").val();
        var course = JSON.stringify(course_data);
        console.log(course);
        // course = 0;
        // alert('user'+userId);
        //  alert($("input:radio[name=paymentOption]").prop("checked"));

        if ($("input[type='radio']:checked").val() == 3) {
            //  alert('ACOD');
            var paymentMode = 'ACOD';
        } else {
            var paymentMode = '';
        }
        //  return;


        if (payableAmount > 0) {
            Meteor.call('payment_subscription', payableAmount, merchant, is_express_checkout, userId, course, couponCode, paymentMode, function (error, result) {
                console.log('transaction_result', JSON.parse(result.content));
                template.$(".proceedbtn").hide();
                template.$(".proceedbtnwidth").append('<button class="btn">Processing...</button>');
                var data = JSON.parse(result.content);
                Session.set('post_payment_landing_page', data.landing_page);
                if (data.status) {
                    var surl = data.result_data.successUrl;
                    var furl = data.result_data.failureUrl;
                    var txnid = data.result_data.txnId;
                    // var amount = payableAmount //data.result_data.amount;
                    var amount = data.result_data.amount;
                    var productinfo = 'Package purchase';

                    var name = '';
                    var email = '';
                    var phone = '';
                    // alert('user'+userId);
                    console.log('userId', userId);
                    Meteor.call('webUserInfo', userId, function (error, result) {
                        console.log('webUserInfo', result);
                        name = result.name;
                        email = result.email;
                        if (result.phone) {
                            var phone = result.phone;
                        }
                    });
                    /************** Saving user address corresponding to txnid********************/
                    if ($("#inlineCheckbox12").prop("checked") == true) {
                        // alert('same checked same');
                        var isSame = true;
                    }
                    var billingName = $("input[name='billing_fname']").val();
                    var billingAddress = $("textarea[name='billing_address']").val();
                    var billingLocality = $("input[name='billing_locality']").val();
                    var billingCityName = $("input[name='billing_city']").val();
                    var billingStateId = $("select[name='billing_state']").val();
                    //var billmobno     = $("input[name='billing_mob_no']").val();
                    var billingZip = $("input[name='billing_zip']").val();

                    var shippingName = $("input[name='ship_fname']").val();
                    var shippingaddress = $("textarea[name='ship_address']").val();
                    var shiplocallity = $("input[name='ship_locality']").val();
                    var shippingcityName = $("input[name='ship_city']").val();
                    var shippingstateId = $("select[name='ship_state']").val();
                    var shippingmobileNo = $("input[name='ship_mob_no']").val();
                    var shippingzip = $("input[name='ship_zip']").val();

                    var token = 'global';

                    Meteor.call('save_user_address', userId, token, txnid, isSame, billingName, billingAddress, billingLocality, billingCityName, billingStateId, billingZip, shippingName, shippingmobileNo, shippingaddress, shippingcityName, shippingstateId, shippingzip, function (error, result) {
                        var data = JSON.parse(result.content);
                        // alert(data);
                        console.log(data);
                        if (data.status) {
                            // toastr.success('Your address saved successfully.','Success');
                            // alert('saved');
                        } else {
                            // toastr.error('unable to save your address.','Error');
                            // alert('failed');
                        }

                    });

                    /************** *End of Address saving . now send user to payu  *  *******************/

                    Meteor.call('payU_payment', surl, furl, txnid, amount, productinfo, name, email, phone, function (error, result) {
                        Session.set('payU_pay', result);
                        console.log('payU_pay', result.headers.location);
                        window.location.href = result.headers.location;
                    });
                } else {
                    $('#mask1').hide();
                    alert(data.message);
                    template.$(".proceedbtn").show();
                    template.$(".proceedbtn").next('.btn').remove();
                }
            });
        } else {
            $('#mask1').hide();
            toastr.error('Sorry, currently we are unable to process your request!', 'Error');
            // alert('Sorry, currently we are unable to process your request!');
        }

    }
};
