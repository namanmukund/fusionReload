Template.bms_tests.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Session.setTemp('nextitem', 0);
Session.setTemp('previtem', 0);
Session.set('savedQuesArr','');
Session.set('challangerQues','');
user_id = Session.get('landing_user_profile_id');

Template.bms_tests.events({
    'click .nextpri':function(){
        var quesId = Session.get('test_questions');
        var oldQues = Session.get('ques_detail');
        var ques1= quesId[parseInt(Session.get('nextitem'))];
        var selectedOpt = "-1";
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
        }
        
        quesArr = getFinalArrBms(ques1,selectedOpt,oldQues,quesArr);
        var ques = [];
        var no = parseInt(Session.get('nextitem'))+1;
        ques.push(quesId[no]);
        Meteor.call('getQuestions', ques, true, function(error, resultQues){
            Session.setTemp('ques_detail', resultQues);
            Session.setTemp('nextitem', no);
            Session.setTemp('previtem', no-1);
        });
        
    },
    'click .priitem':function(){
        var quesId = Session.get('test_questions');
        var oldQues = Session.get('ques_detail');
        var no = parseInt(Session.get('previtem'));
        var ques1= quesId[no];
        var selectedOpt = "-1";
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
        }
        
        quesArr = getFinalArrBms(ques1,selectedOpt,oldQues,quesArr);
        
        var ques = [];
        ques.push(quesId[no]);
        Meteor.call('getQuestions', ques, true, function(error, resultQues){
            Session.setTemp('ques_detail', resultQues);
            Session.setTemp('nextitem', no);
            Session.setTemp('previtem', no-1);
        });
    },
    'click .quesNo':function(event,template){
        var quesId = Session.get('test_questions');
        var oldQues = Session.get('ques_detail');
        var quesNo = event.currentTarget.id;
        var nos = quesNo.split('_');
            no = parseInt(nos[1]);
        var ques1= quesId[no];
        var selectedOpt = "-1";
        var marks = Session.get('marks');
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
        }
        
        quesArr = getFinalArrBms(ques1,selectedOpt,oldQues,quesArr);
        var ques = [];
        ques.push(quesId[no]);
        Meteor.call('getQuestions', ques, true, function(error, resultQues){
            Session.setTemp('ques_detail', resultQues);
            Session.setTemp('nextitem', no);
            Session.setTemp('previtem', no);
        });
    }
});

Template.headertest.helpers({
    'bmsColour': function () {
        var source = Router.current().params.query.source;
        if(source=='bms'){
           var bmsColour="bms-bg";
        }else{
            var bmsColour="blue-bg";
        }
        return bmsColour;
    }
});

Template.start_bms_test.helpers({
    'start_mock_test': function () {
        incQues=1;
        quesArr=[];
        testArr=[];
        optArr=[];
        user_id = Session.get('landing_user_profile_id');
        start = new Date();
        var arr = Session.get('test_questions');
        return _.map(arr, function(val, index) {
            return {index: index, value: val};
        });
    },
    'ques_detail': function () {
        var ques = Session.get('ques_detail');
        return ques;
    },
    'test_detail': function () {
        return Session.get('testVal');
    },
    'test_id':function(){
        return Session.get('tId');
    },
    'incrementQues':function(){
        return incQues++;
    },
    'nextitem':function(){
        return Session.get('nextitem');
    },
    'qNo':function(){
        $('.quesNo').removeClass('colorgry');
        var qn=parseInt(Session.get('nextitem'));
        var arr = Session.get('test_questions');
        $.each(quesArr, function(i, n) {
            if(parseInt(n.question_attempt_status)===1){
                var indx = jQuery.inArray(n.id,arr);
                $('#ques_'+indx).addClass('colorskybl');   
            }
        });
        var curQ = Session.setTemp('currQ',qn+1);
        $.each(quesArr, function(i, n) {
            if(parseInt(n.id)===parseInt(arr[qn])){
                $('#'+parseInt(n.selectedAnswer)).prop('checked', true);
                return false;
            }
            return true;
        });
        $('#ques_'+qn).addClass('colorgry');
        return qn+1;
    },
    'shouldBeDisabled':function(){
        var arr = Session.get('test_questions');
        if (Session.get('currQ') === arr.length) {
            $('#bmsTest').hide();
            return {disabled: true};
        } else {
            $('#bmsTest').show();
            return {};
        }
    },
    'timerBms':function(duration){
        clearInterval(tBms);
        if(parseInt(duration)>0){
            timedCount(parseInt(duration)*60);
        } else {
            $('#timer').html('00:00:00');
        }
    },
    'user_id':function(){
        return Session.get('user_id');
    },
    'totalQuestion':function(){
      arr = Session.get('test_questions');
      if(arr){
        return arr.length;
      } else {
        return 0; 
      }
    },
    'loadScript':function(q){
        if(q>0){
            return true;   
        } else {
            return false;
        }
    }
});

Template.start_bms_test.rendered = function() {
    var parmsLen = Router.current().params;
    if(Object.keys(parmsLen).length==0){
        Router.go ('test_error',{},{query: 'source=bms'});
    } else {
        if(parmsLen.tId==0 || parmsLen.tId==''){
            if(typeof parmsLen.query.source =='undefined'){
                Router.go ('test_error',{},{query: 'source=course'});
            } else {
                Router.go ('test_error',{},{query: 'source='+parmsLen.query.source});
            }
        }
        
    }
    
    var tId = Router.current().params.tId;
    var cId = Router.current().params.cId;
    var source = Router.current().params.query.source;
    Session.setTemp('source',source);
    if(tId>0 && cId>0){
        Meteor.call('webTestDetails', tId, function(error, result){
            Session.setTemp('testVal', result);
        });
        Meteor.call('getQuestionsId', parseInt(tId), parseInt(cId), function(error, result){
            Session.setTemp('test_questions', result);
            var ques = [];
            ques.push(result[0]);
            Meteor.call('getQuestions', ques, true, function(error, resultQues){
                console.log(resultQues);
                Session.setTemp('ques_detail', resultQues);
            });
        });
    } else {
        Router.go ('test_error',{},{query: 'source='+Session.get('source')});
    }
}


Modal.allowMultiple = true;
Template.start_bms_test.events({
    "click #confirmBox" : function(e) {
        e.preventDefault();
        var oldQues = Session.get('ques_detail');
        /*Get Last Selected Item Start*/
        var quesId = Session.get('test_questions');
        var no = parseInt(Session.get('nextitem'));
        var ques1= quesId[no];
        var selectedOpt = "-1";
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
        }
        
        quesArr = getFinalArrBms(ques1,selectedOpt,oldQues,quesArr);
        
        /*Get Last Selected Item End*/
        var marksObtained=0;
        var selectArr = [];
        $.each(quesArr, function(i, n) {
            selectArr.push(n.id);
        });
        
        attempted = 0;
        unAttempted = 0;
        var currentUserArr = [];
        var arrLen = quesArr.length;
        for(var i=0;i<quesId.length;i++){
            if(jQuery.inArray(quesId[i],selectArr) == -1){
                var ques = [];
                ques.push(quesId[i]);
                Meteor.call('getQuestions', ques, true, function(error, oldArr){
                    var optArrBms = [];
                    var crOption = -1;
                    var crOptionText = '';
                    $.each(oldArr[0].options, function(j, op) {
                        if(op.right_options){
                            crOption = op.id;
                            if(j==0){
                                crOptionText='Answer A';
                            } else if(j==1){
                                crOptionText='Answer B';
                            } else if(j==2){
                                crOptionText='Answer C';
                            } else if(j==3){
                                crOptionText='Answer D';
                            } else if(j==4){
                                crOptionText='Answer E';
                            }
                        }
                        var objOptArrBms = {
                            "explanation" : op.explanation, 
                            "id" : op.id, 
                            "localSelectedOption" : false,
                            "right_options" : op.right_options,
                            "selected" : false,
                            "statement" : op.statement
                        }
                        optArrBms.push(objOptArrBms);
                    });
                    
                    var obj1 = {
                        "correctAnswer" : crOption,
                        "difficulty_level_id" : oldArr[0].difficulty_level_id, 
                        "id" : oldArr[0].id, 
                        "options" : optArrBms, 
                        "questionNumber" : parseInt(quesArr.length)+1,
                        "question_attempt_status" : 0, 
                        "question_marks" : oldArr[0].question_marks,
                        "question_statements" : oldArr[0].question_statements, 
                        "question_type_id" : oldArr[0].question_type_id, 
                        "selectedAnswer" : "-1",
                        "timetaken" : 0
                    };
                    /*-----------*/
                    var attpArr={
                        'attp':'',
                        'skip':'Yes',
                        'qNo':parseInt(quesArr.length)+1,
                        'corrAns':crOptionText,
                        'corrStatus':'Incorrect'
                    }
                    currentUserArr.push(attpArr);
                    /*-----------*/
                    quesArr.push(obj1);
                    obj1={};
                    attpArr={};
                });
                unAttempted+=1;
            } else {
                /*-----------*/
                var crOptionText = '';
                var crText = 'Incorrect';
                $.each(quesArr[i].options, function(j, op) {
                    if(op.right_options){
                        if(j==0){
                            crOptionText='Answer A';
                        } else if(j==1){
                            crOptionText='Answer B';
                        } else if(j==2){
                            crOptionText='Answer C';
                        } else if(j==3){
                            crOptionText='Answer D';
                        } else if(j==4){
                            crOptionText='Answer E';
                        }
                    }
                });
                
                if(quesArr[i].selectedAnswer==quesArr[i].correctAnswer){
                    crText='Correct';
                    marksObtained += parseInt(quesArr[i].question_marks);
                }
                
                var att=skip='';
                if(quesArr[i].selectedAnswer=="-1"){
                    skip='Yes';
                    unAttempted+=1;
                } else {
                    att = 'Yes';
                    attempted+=1;
                }
                var attpArr={
                    'attp':att,
                    'skip':skip,
                    'qNo':quesArr[i].questionNumber,
                    'corrAns':crOptionText,
                    'corrStatus':crText
                }
                currentUserArr.push(attpArr);
                /*-----------*/
            }
        }

        Meteor.setTimeout(function(){
            Session.setTemp('attempted',attempted);
            Session.setTemp('unAttempted',unAttempted);
            Session.set('savedQuesArr',currentUserArr);
            Session.set('marksObtained',marksObtained);
        },500);
        Modal.show('infoBox');
    }
});


Template.infoBox.helpers({
    'attempted':function(){
       return Session.get('attempted');
    },
    'unAttempted':function(){
       return Session.get('unAttempted');
    },
    'scoreInfo':function(){
       return Session.get('savedQuesArr');
    },
    'colorQ':function(color){
        if(color=='Yes'){
            return 'skyye';
        } else {
            return 'graycolor';
        }
    },
    'messageClose':function(){
        if(Session.get('timeUp')=='Yes'){
            return 'Your time is up please click yes to process.';
        } else {
            return '';
        }
    }
});

Template.infoBox.events({
    'click #saveTest': function(event, template){
        Modal.hide('infoBoxMock');
        Session.set('currentUserQues',Session.get('savedQuesArr'));
        Session.set('currentUserScore',Session.get('marksObtained'));
        var testDetail = Session.get('testVal');
        var qList = {
            "questionList" : quesArr,
        };
        var ttimetaken = ((new Date()-start)/1000);
        
        var gradeId=Session.get("global_grade_id");
        var subjectId=Session.get("routeBmsSubjectId");
        var subjectName=Session.get("routeBmsSubjectName");
        var challangeId = Session.get("challangeId");
        if(typeof challangeId == 'undefined' && user_id>0 && gradeId>0 && subjectId>0 && subjectName !='' && testDetail.test_id>0 && testDetail.chapterId>0 && quesArr.length>0){
            Modal.hide('infoBox');
            Meteor.call('submitBmsWeb', parseInt(user_id), parseInt(gradeId), parseInt(subjectId), subjectName, parseInt(testDetail.test_id), Session.get('marksObtained'),ttimetaken,JSON.stringify(qList),'global',parseInt(Session.get('opponentId')),testDetail.test_duration,testDetail.total_question,parseInt(testDetail.chapterId),function(error, result){
                if(result.data.status){
                    Router.go('beatMyScore', {tId:parseInt(testDetail.test_id)},{query: 'source='+Session.get('source')});
                } else {
                    Router.go ('test_error',{},{query: 'source='+Session.get('source')});
                }
            });
        } else if(typeof challangeId != 'undefined' && challangeId>0 && user_id>0 && gradeId>0 && subjectId>0 && subjectName !='' && testDetail.test_id>0 && testDetail.chapterId>0 && quesArr.length>0){
            var challengerId = Session.get("challengerId");
            var challengeCompleterName = Session.get("challengeCompleterName");
            Meteor.call('submitBmsChallangeWeb', challangeId, challengerId, parseInt(user_id), challengeCompleterName, parseInt(gradeId), parseInt(testDetail.test_id), Session.get('marksObtained'),ttimetaken,JSON.stringify(qList),'global',parseInt(testDetail.chapterId),function(error, result){
                Session.set('resultChallanger',result);
                if(result.data.status){
                    Router.go('beatMyScore', {tId:parseInt(testDetail.test_id)},{query: 'source='+Session.get('source')});
                } else {
                    Router.go ('test_error',{},{query: 'source='+Session.get('source')});
                }
            });
        } else {
            Router.go ('test_error',{},{query: 'source='+Session.get('source')});
        }
    },
    'click #cancelTest': function(event, template){
        Modal.hide('infoBox');
    }
});
// ques1 for selected quesId
// selectedOpt for selected optionId
// oldQues for selected question Details
// status 0 for true 1 for false
// quesArr return final Array
function getFinalArrBms(qid,selId,oldArr,qArr){
    if(qArr.length>0){
        var found=0;
        $.each(qArr, function(i, n) {
            if(qid==n.id){
                found=1;
                //if(selId !=-1){
                    var optArrBms = [];
                    $.each(qArr[i].options, function(j, opt) {
                        var crSelected=false;
                        if(opt.id==selId){
                            qArr[i].selectedAnswer=selId;
                            crSelected=true;
                        }
                        var objOptArrBms = {
                            "explanation" : opt.explanation, 
                            "id" : opt.id, 
                            "localSelectedOption" : crSelected,
                            "right_options" : opt.right_options,
                            "selected" : false,
                            "statement" : opt.statement
                        }
                        optArrBms.push(objOptArrBms);
                    });
                    qArr[i].options=optArrBms;
                //}
            }
        });
        
        if(found==0){
            //if(selId !=-1){
                var optArrBms = [];
                var crOption = -1;
                var attemptStatus = 0;
                if(selId!="-1"){
                    attemptStatus=1;
                }
                $.each(oldArr[0].options, function(i, op) {
                    var crSelected=false;
                    if(selId==op.id){
                        crSelected=true;
                    }
                    if(op.right_options){
                        crOption = op.id;   
                    }
                    var objOptArrBms = {
                        "explanation" : op.explanation, 
                        "id" : op.id, 
                        "localSelectedOption" : crSelected,
                        "right_options" : op.right_options,
                        "selected" : false,
                        "statement" : op.statement
                    }
                    optArrBms.push(objOptArrBms);
                });
                var obj1 = {
                    "correctAnswer" : crOption,
                    "difficulty_level_id" : oldArr[0].difficulty_level_id, 
                    "id" : oldArr[0].id, 
                    "options" : optArrBms, 
                    "questionNumber" : Session.get('currQ'),
                    "question_attempt_status" : attemptStatus, 
                    "question_marks" : oldArr[0].question_marks,
                    "question_statements" : oldArr[0].question_statements, 
                    "question_type_id" : oldArr[0].question_type_id, 
                    "selectedAnswer" : selId,
                    "timetaken" : 0
                };
                qArr.push(obj1);
            //}
        }
    } else {
        //if(selId !=-1){
            var optArrBms = [];
            var crOption = -1;
            var attemptStatus = 0;
            if(selId!="-1"){
                attemptStatus=1;
            }
            $.each(oldArr[0].options, function(i, op) {
                var crSelected=false;
                if(selId==op.id){
                    crSelected=true;
                }
                if(op.right_options){
                    crOption = op.id;   
                }
                var objOptArrBms = {
                    "explanation" : op.explanation, 
                    "id" : op.id, 
                    "localSelectedOption" : crSelected,
                    "right_options" : op.right_options,
                    "selected" : false,
                    "statement" : op.statement
                }
                optArrBms.push(objOptArrBms);
            });
            var obj1 = {
                "correctAnswer" : crOption,
                "difficulty_level_id" : oldArr[0].difficulty_level_id, 
                "id" : oldArr[0].id, 
                "options" : optArrBms, 
                "questionNumber" : Session.get('currQ'),
                "question_attempt_status" : attemptStatus, 
                "question_marks" : oldArr[0].question_marks,
                "question_statements" : oldArr[0].question_statements, 
                "question_type_id" : oldArr[0].question_type_id, 
                "selectedAnswer" : selId,
                "timetaken" : 0
            };
            qArr.push(obj1);
        //}
    }
    
    return qArr;
}

var tBms;
function timedCount(timedCounter){
    var hours =parseInt(timedCounter/3600)%24;
    var minutes =parseInt(timedCounter/60)%60;
    var seconds =timedCounter%60;
    var result = (hours<10?"0"+hours:hours)+":"+(minutes<10?"0"+minutes:minutes)+":"+(seconds<10?"0"+seconds:seconds);
    $('#timer').html(result);
    if(timedCounter==0){
        clearInterval(tBms);
        $('#prevbtn').hide();
        $('#bmsTest').hide();
        $('#nextbtn').hide();
        Session.setTemp('timeUp','Yes');
        $( "#confirmBox" ).trigger( "click" );
    } else {
        timedCounter=timedCounter-1;
        tBms = setTimeout(function(){ timedCount(timedCounter)},1000);   
    }
}


Template.headertest.events = {
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
    }
};

Template.headertest.helpers({
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
