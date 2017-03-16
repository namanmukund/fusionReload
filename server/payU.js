/*
Configure::write('PAYU_VARIABLES', array('PAYU_BASE_URL'=>'https://test.payu.in/_payment','MERCHANT_KEY'=>'C0Dr8m','surl'=>'Cart/success','furl'=>'Cart/failed','curl'=>'Cart/cancel','salt'=>'3sf0jURk'));

define('PAYU_BASE_URL','https://test.payu.in/_payment');
define('MERCHANT_KEY','C0Dr8m');//C0Ds8q

*/
//payment_subscription: function (payableAmount, merchant, is_express_checkout, userId, course, couponCode) {
var Api = new Restivus({
    apiPath: 'payment_web',
    useDefaultAuth: false,
    prettyJson: true
  }); 
  
Api.addRoute('success', {
		post: function () { 
			var params = this.bodyParams;  
			console.log('params',params);
                        window.location.href = 'http://localhost:3000/success';     
                } 
});  

Api.addRoute('failure', {
		post: function () { 
			var params = this.bodyParams;  
			console.log('params',params);
                        window.location.href = 'http://localhost:3000/failure';  
                } 
}); 



  Meteor.methods({
     payU_payment: function (surl, furl , txnid, amount, productinfo, name, email, phone, source) {
         this.unblock();
         try {
             var hash = CryptoJS.SHA512("PeVRRj|"+txnid+"|" +amount+"|"+productinfo+"|"+name+"|"+email+"|||||||||||KBLc5AtD").toString();
             console.log('hash',hash);
             var result = HTTP.call("POST", "https://secure.payu.in/_payment",
                 {params: {
                         "key":'PeVRRj',
                         "surl":surl,
                         "furl":furl,
                         "salt":'KBLc5AtD',
                         "txnid":txnid,
                         "amount":amount,
                         "productinfo": productinfo,
                         "firstname":name,
                         "email": email,
                         "phone": phone,
                         "hash":hash
                 }}
             );
            console.log('try',result);
           return result;
         } catch (e) {
           // Got a network error, time-out or HTTP error in the 400 or 500 range.
           //console.log('false');
           console.log('message',e);
           return false;
         }  
     }
 });
 
 

  
  