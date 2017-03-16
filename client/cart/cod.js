Template.codnow.helpers({
  totalFinalPayable:function(){
    return Session.get('totalFinalPayable');
  },
  totalPayAmountforCod:function(){
    return (Session.get('totalFinalPayable')-500).toFixed(2);
  },

});

Template.codnow.events = {
    "click #bankdeposit": function (event,template) {
      event.preventDefault();
      $('#onlinepaymnt').removeClass('active');
      $("#bankdeposit").addClass('active');
      $('.bankdeposit').show();
      $('.onlinepaymnt').hide();
      $('#finalpayment').hide();
      return true;
    },
    "click #onlinepaymnt": function (event,template) {
      event.preventDefault();
      $('#bankdeposit').removeClass('active');
      $("#onlinepaymnt").addClass('active');
      $('.onlinepaymnt').show();
      $('.bankdeposit').hide();
      $('#finalpayment').show();
      return true;
    },
    "click #onlinepaymntop": function (event,template) {
      // event.preventDefault();
        $('.optioncodselected').hide();
        $('#finalpayment').show();
        return true;
    },
    "click #codpaymntop": function (event,template) {
      if(Session.get('express_checkout_data')){
        var excartData = Session.get('express_checkout_data');
        if(excartData.package_type =='chapter'){
          event.preventDefault();
          toastr.error('Cash on Delivery is not available for chapter unlock');
          return false;
        }
      }
      var totalpayment = Session.get('totalFinalPayable');
      if(totalpayment<500){
        event.preventDefault();
        toastr.error('For Cash on Delivery your total payable amount must be greater than Rs.500/-');
        return false;
      }
      // event.preventDefault();
      $('.optioncodselected').show();
      $('.cod').show();
      $('.paymenttype').show();
      $('.onlinepaymnt').show();
      $('.bankdeposit').hide();
      return true;
    },
    "click #check_pincode_cod": function (event,template) {
      // event.preventDefault();
        var pin_value = document.getElementById("get_pin_value").value;
            if (isNaN(pin_value) || pin_value < 100000) {
                toastr.warning('Invalid Pin Code');
                return false;
            }else{
                Meteor.call('isDeliveryAvailable', pin_value, function (error, result) {
                    if(result){
                        if(result.bluedart==1 || result.bluedart==1 || result.bluedart==1){
                            toastr.success('Delivery is available at this location');
                        }else{
                            toastr.warning('Delivery is not available at this location');
                        }
                    }else{
                        toastr.warning('Delivery is not available at this location');
                    }
                })
            }
            
    }
  }
