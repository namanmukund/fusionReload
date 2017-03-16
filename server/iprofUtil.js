var Api = new Restivus({
   
    useDefaultAuth: false,
    prettyJson: true,
	defaultHeaders: {
      "Content-Type":"application/json",
	 "charset":"UTF-8"
    }
});

var lmsIP=Meteor.settings.lmsIP;
console.log("lmsIP=="+lmsIP);

Api.addRoute('cacheTesting', {

      post: function () { 	 
   //logger = Meteor.require('winston');
   //logger.info('Request::', JSON.stringify(this.bodyParams));
console.log("lmsIP=="+lmsIP);
   console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
   //debugger;
   var filePath=encodeURI("live video");
	console.log("filePath=="+filePath);    
   // var summary=Meteor.call("getSummaryByCategoryId",52);
    //console.log("summary==",JSON.stringify(summary));
    	//return "Done"
//Meteor.call('getPackagesByGradeAndSuubject',55,142);
Meteor.call('cacheTOC');
return "Done";
   
     }
    });

/////

Api.addRoute('unitTesting', {

      post: function () { 
      var params=this.bodyParams;
      var packageId=params.packageId;
      console.log("packageId==",packageId);
      var queryResult = Preferences.find( {},                
                 
                   { fields:
                    {"id":1,"_id":0
                    }}).fetch();  
   console.log("queryResult=="+JSON.stringify(queryResult));
      if (queryResult&&queryResult.length>0) {
        //code
        for (var i=0; i<queryResult.length;i++) {
           var id=queryResult[i]["id"];
        console.log("id===",id);
        HTTP.call("POST", "http://localhost:3000/course/getSummaryByCategoryId",
                      {params: {                        
                        "categoryId": id,
                        "sub_category_id":parseInt(params.categoryId) 
                                                    
                      }}
                  );
        }
        
      }

   //return Meteor.call('cacheTOC');
     }
    });
	Api.addRoute('hindiTesting', {

      get: function () { 
   
   console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
    var queryResult = Packages.find( {id:6028},                
                 
                   { fields:
                    {"id":1,"name":1,"_id":0
                    }}).fetch();  
return queryResult[0];//.encoding("UTF-8");
   
     }
    });

                
                
