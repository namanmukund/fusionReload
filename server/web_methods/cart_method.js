var methodurl=Meteor.settings.globalApiUrl;
console.log(methodurl);
Meteor.methods({
    add_to_cart: function (dataFrom,type,userId,packageId,token,packageSubscriptionId) {
        this.unblock();
        console.log('dataFrom',dataFrom);
        console.log('type',type);
        console.log('userId',userId);
        console.log('packageId',packageId);
        console.log('token',token);
        console.log('packageSubscriptionId',packageSubscriptionId);
        
        console.log('methodurl',methodurl);
		try {
            var result = HTTP.call("POST", methodurl+"/AddToCart/add",
                    {params: {
                            "result": "json",
                            "dataFrom":'tdl',
                            "type": type,
                            "userId": userId,
                            "packageId": packageId,
                            "token": token,
                            "packageSubscriptionId": packageSubscriptionId
                        }}
            );
            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});
Meteor.methods({
    delete_from_cart: function (type,userId,packageId,packageSubscriptionId) {
        this.unblock();
		try {
            var result = HTTP.call("POST", methodurl+"/AddToCart/delete",
                    {params: {
                            "result": "json",
                            "type": type,
                            "userId": userId,
                            "packageId": packageId,
							"packageSubscriptionId":packageSubscriptionId,
							"token":'global'
                        }}
            );
            //console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});
Meteor.methods({
    lists_cart: function (userId) {
        this.unblock();
		console.log('list cart');
		console.log(methodurl);
		try {
            var result = HTTP.call("POST", methodurl+"/AddToCart/lists",
                    {params: {
                            "result": "json",
                            "userId": userId,
							"token":'global'
                        }}
            );
            //console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    coupon_code_validation: function (userId,coupon,token,type,purchase_type,validity_id,is_express_checkout,subscription_id) {
        this.unblock();
		console.log(userId);
                console.log(coupon);
                console.log(token);
                console.log(type);
                console.log(purchase_type);
                console.log(validity_id);
                console.log(is_express_checkout);
                console.log(subscription_id);
                
                
		console.log(methodurl);
		try {
            var result = HTTP.call("POST", methodurl+"/AddToCart/call",
                    {params: {
                            result: "json",
                            userId: userId,
                            coupon:coupon,
                            token: token,
                            type:type,
                            purchase_type:purchase_type,
                            validity_id:validity_id,
                            is_express_checkout:is_express_checkout,
                            subscription_id:subscription_id
                        }}
            );
            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log(e);
            return false;
        }
    }
});


Meteor.methods({
    getstatelist: function (userId,token) {
        this.unblock();
        console.log('getstatelist');
        console.log(methodurl);
       try {
            var result = HTTP.call("POST", methodurl+"/Users/getAllStates",
                    {params: {
                            "result": "json",
                            "userId": userId,                            
                            "token": token,                            
                        }}
            );  
            console.log('result',result.content);         
            return JSON.stringify(result.content);
        }catch(e){
            console.log('false',e);
            return false;
        }
}

});


Meteor.methods({
    getstatecitylist: function (userId,token,stateId) {
        this.unblock();
        console.log('getstatecitylist');
        console.log(methodurl);
       try {
            var result = HTTP.call("POST", methodurl+"/Users/getAllCitiesByState",
                    {params: {
                            "result": "json",
                            "userId": userId,
                            "stateId": stateId,                        
                            "token": token,                            
                        }}
            );  
            console.log('result',result);         
            return result;
        }catch(e){
            console.log('false',e);
            return false;
        }
}

});

Meteor.methods({
    save_user_address: function (userId, token,txnid, isSame, billingName, billingAddress, billingLocality,billingCityName, billingStateId, billingZip,shippingName, shippingmobileNo, shippingaddress, shippingcityName, shippingstateId,shippingzip) {
        this.unblock();
        try {
            var result = HTTP.call("POST", methodurl+"/Users/saveUserShipAndBillAddress",
                    {params: {
                            result: "json",
                            userId : userId,
                            token : token,
                            isSame : isSame, 
                            txnId : txnid,
                            billName        : billingName,
                            billAddress     : billingAddress, 
                            billLocality    : billingLocality,
                            billingCityName : billingCityName ,
                            billState       : billingStateId,
                            billZip         : billingZip,

                            shipName : shippingName,
                            mobileNo : shippingmobileNo,
                            address  : shippingaddress,
                            cityName : shippingcityName,
                            stateId  : shippingstateId,
                            zip      : shippingzip
                        }}
            );
            console.log('result save address',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log(e);
            return false;
        }
    }
});

Meteor.methods({
    coupon_code_validation_exp_chkout: function (userId,coupon,token,type, is_express_checkout, packageSubscriptionId, packageId) {
        this.unblock();
		console.log(userId);
                console.log(coupon);
                console.log(token);
                console.log(type);
                console.log(is_express_checkout);
                console.log(packageSubscriptionId);
                console.log(packageId);
                
                
		console.log(methodurl);
		try {
            var result = HTTP.call("POST", methodurl+"/AddToCart/call",
                    {params: {
                            result: "json",
                            userId: userId,
                            coupon:coupon,
                            token: token,
                            type:type,
                            is_express_checkout:is_express_checkout,
                            package:'package',
                            packageSubscriptionId: packageSubscriptionId,
                            packageId: packageId
                        }}
            );
            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log(e);
            return false;
        }
    }
});