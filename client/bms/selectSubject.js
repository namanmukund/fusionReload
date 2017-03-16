Template.bmsSelectSubject.rendered = function () {

// 'getBmsUsers': function(gradeId,subjectId,userId) {
Meteor.call('getSubjectsIDWeb', 55, function (error, result) {
        console.log("getSubjectsIDWeb",result);
        Session.set('getSubjectsIDWeb', result);
        // alert(JSON.stringify(result));

    });

	}


Template.bmsSelectSubject.helpers({
    'getSubjectsIDWeb': function () {
        var getSubjectsIDWeb = Session.get('getSubjectsIDWeb');
       
        if (getSubjectsIDWeb) {
        return getSubjectsIDWeb;	
            
        }
        // alert(JSON.stringify(getBmsUsers[0]["userImageUrl"]));
        
    }
});
