Template.bmsSubject.rendered = function () {
     $(window).scrollTop(0);
    var gradeId ;
    var subjectId ;
    var categoryId;
    var subCategoryId;


    if(localStorage.getItem("category")){
//      console.log('user_preference_cache',(localStorage.getItem("userPrefrences")));
        Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
//            console.log('grade_id_new',localStorage.getItem("userId"));
        Session.set('courseIdCache',(localStorage.getItem("course")));
//            console.log('courseId_new',localStorage.getItem("course"));
        Session.set('selectedSubjectsCache',(localStorage.getItem("subjectIDS")));
        categoryId= localStorage.getItem("category");
        subCategoryId=localStorage.getItem("subCategory");
        Session.set('categoryNameCache',(localStorage.getItem("categoryName")));
        Session.set('subCategoryNameCache',(localStorage.getItem("subCategoryName")));
        Session.set('courseNameCache',(localStorage.getItem("courseName")));
//            console.log('selectedSubjects',localStorage.getItem("subjectIDS"));
//            console.log('a',Session.get('categoryNameCache'));
//            console.log('b',Session.get('subCategoryNameCache'));
//            console.log('c',Session.get('courseNameCache'));
    }
    var userId =  Session.get('landing_user_profile_id');
    if(Session.get('selectedSubjects') && Session.get('courseId') && Session.get('category') && Session.get('subCategory') ){
            gradeId =  Session.get('courseId');
            console.log('grade_id_new',gradeId);
            var subject_id =  Session.get('selectedSubjects');
            var parseSubjects=[];
            console.log('subject_id_wall',subject_id);

            $.each(subject_id,function(index,value){
             var intsubject=parseInt(value);
             parseSubjects.push(intsubject);
            })
            subjectId = parseSubjects;
    }else{
        gradeId =  Session.get('courseIdCache');
        var subject_id  = Session.get('selectedSubjectsCache');
        var array_subject_id = subject_id.split(',');
            console.log('subjectId_cache',array_subject_id);
            console.log('courseIdCache',gradeId);
            var parseSubjects=[];
            $.each(array_subject_id,function(index,value){
                var intsubject = parseInt(value);
//                console.log('intsubject',intsubject);
                parseSubjects.push(intsubject);
                subjectId  = parseSubjects;
            })
    }
//        console.log('user_preference_cache',(localStorage.getItem("userPrefrences")));

    // alert(categoryId+subCategoryId+gradeId+subjectId);
    if(Session.get('global_grade_id')&&Session.get('global_subject_id')){
        gradeId = Session.get('global_grade_id');
        subjectId = Session.get('global_subject_id');
    }
    Meteor.call('fetchPreferenceWeb', parseInt(categoryId),parseInt(subCategoryId),parseInt(gradeId),subjectId, 
        function (error, result) {
        console.log("getSubjectsIDWeb",result.subjects);
        // alert(result);
        Session.set('getSubjectsIDWeb', result.subjects);
        // alert(JSON.stringify(result));

    });

// 'getBmsUsers': function(gradeId,subjectId,userId) {


	}


Template.bmsSubject.helpers({
    'getSubjectsIDWeb': function () {
        var getSubjectsIDWeb = Session.get('getSubjectsIDWeb');
        console.log('getSubjectsIDWeb',getSubjectsIDWeb);
        if (getSubjectsIDWeb) {
        return getSubjectsIDWeb;	
            
        }
        // alert(JSON.stringify(getBmsUsers[0]["userImageUrl"]));
        
    }
});


Template.bmsSubject.events({
    'click .opponentbox': function(e) {
        e.preventDefault();
        console.log("subject clicked",this);
        Session.set("routeBmsSubjectId",this.id);
        Session.set("routeBmsSubjectName",this.name);
          // <a href="/user_tests?tId={{test_id}}&cId={{chapterId}}" id="{{test_id}}"
          // var chapterId=2776502;
          // var testId=50601;

        // var element= $('input[name="bmsRadio"]:checked', event.target).data('answer');
        // alert("hey");

        // $('#clickBmsSubject input').on('change', function() {
   var element=$('input[name="bmsRadio"]:checked', '#clickBmsSubject').val(); 


       // var element= $('input[name=bmsRadio]:checked').val()
       
        console.log('element',element);
        localStorage.setItem("bmsSubjectId", element);
        Session.set("bmsSubjectId",element);

    

        Router.go('/landing/bmsSubject/bmsOpponent');
        // });
          
         
    }
});

Template.bmsBreadcrumb.events({
        "click .bmsSubjectToHome": function () {
        go_to_wall_from_bms(0);
    }
});




Template.header_bmsSubject.events = {
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
    "click .log_out_button" : function(e) {
        e.preventDefault();
        console.log('logout');
        localStorage.removeItem('userId');
        window.location.reload(true);  
    }
};
Template.header_bmsSubject.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside',data);
        if(!data){
            return true;
        }
    },
    login_user_name: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside',data);
        if(data){
                Meteor.call('webUserInfo',data, function(error, result){
                    console.log('webUserInfo',result);
                        Session.set('login_check_name',result.name);
                });
            console.log('login_check',data);
            return Session.get('login_check_name');
        }
    }
});

Template.bms_navigation.events = {
     "click #home_page": function (e){
           var url_string = Session.get('courseName');
           var id = Session.get('global_grade_id');
           var slugData = getcustomData(url_string);
           Router.go('/'+slugData+'/'+id);
           //Router.go('/wall');     
     },
     "click #course_page": function (e){
           var slugData = getcustomData(Session.get('about_course_title'));
           Router.go('/courses/'+slugData);
           //Router.go('/courses');     
     },
     'click #tutor_page': function (event) {
         Router.go('/tutors');
     },
     'click #test_page_disable': function (event) {
        Modal.show('no_tests');
     },
     'click #test_page': function (event) {
          var slugData = getcustomData(Session.get('about_course_title'));
          Router.go('/tests/'+slugData);
          //Router.go('/tests');
     },
     'click #course_page_disable': function (event) {
          Modal.show('no_courses');
     }
}


function go_to_wall_from_bms(reload){
    var slugData = getcustomData(Session.get('courseName'));
    var id = Session.get('global_grade_id');
    if(reload==1){
        window.location.href='/'+slugData+'/'+id;   
    } else {
        Router.go('/'+slugData+'/'+id);   
    }
}