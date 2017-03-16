Template.bmsOpponent.rendered = function () {
$(document).ready(function () { 
	$('#bmsStepper1').addClass('checked');
});
$(window).scrollTop(0);
	var gradeId ;
	var subjectId ;


	if(localStorage.getItem("category")){
	    Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
	    Session.set('courseIdCache',(localStorage.getItem("course")));
	    Session.set('selectedSubjectsCache',(localStorage.getItem("subjectIDS")));
	    Session.set('categoryNameCache',(localStorage.getItem("categoryName")));
	    Session.set('subCategoryNameCache',(localStorage.getItem("subCategoryName")));
	    Session.set('courseNameCache',(localStorage.getItem("courseName")));
	}
	var userId =  Session.get('landing_user_profile_id');
	if(Session.get('selectedSubjects') && Session.get('courseId') && Session.get('category') && Session.get('subCategory') ){
		gradeId =  Session.get('courseId');
		var subject_id =  Session.get('selectedSubjects');
		var parseSubjects=[];
    
		$.each(subject_id,function(index,value){
		 var intsubject=parseInt(value);
		 parseSubjects.push(intsubject);
		})
		subjectId = parseSubjects;
	} else {
	    gradeId =  Session.get('courseIdCache');
	    var subject_id  = Session.get('selectedSubjectsCache');
	    var array_subject_id = subject_id.split(',');
	    var parseSubjects=[];
	    $.each(array_subject_id,function(index,value){
		var intsubject = parseInt(value);
		parseSubjects.push(intsubject);
		subjectId  = parseSubjects;
	    })
	}
	Meteor.call('getBmsUsers', parseInt(gradeId), [parseInt(subjectId)], parseInt(userId), function (error, result) {
		Session.set('getBmsUsers', result);
	});

}


Template.bmsOpponent.helpers({
    'getBmsUsers': function () {
        var getBmsUsers = Session.get('getBmsUsers');
        var pic ="/images/bmsCircle.png";
        if (getBmsUsers) {
        	for(var i=0;i<getBmsUsers.length;i++){
        		if(getBmsUsers[i]["userImageUrl"]=="default"){
        			getBmsUsers[i]["userImageUrl"]=pic;
        		}
        	}
            
        }
        return getBmsUsers;
    }
});
  

Template.bmsOpponent.events({
    'click .bmsChallenge': function (event) {
      Session.set('opponentId',this.userId);
        var subjectId=Session.get('bmsSubjectId');
        if(subjectId==undefined){
            subjectId=localStorage.getItem("bmsSubjectId");
        }
        var gradeId=localStorage.getItem("course");
        Meteor.call('getBmsTestsLists', parseInt(gradeId), parseInt(subjectId), function (error, result) {
		Session.set('getBmsTestsLists', result);
	});
        Modal.show('bmsPopup');
    }
});


Template.bmsPopup.events({
    'click .bmsProceed': function (event) {
        var result=Session.get('getBmsTestsLists');
	Modal.hide('bmsPopup');
	$('#mask1').show();
        Router.go('bmsTests', {tId:parseInt(result.testId),cId:parseInt(result.chapterId)},{query: 'source=bms'});
    }
});
