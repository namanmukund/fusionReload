Template.mock_tests.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Session.setTemp('nextitem', 0);
Session.setTemp('previtem', 0);
user_id = Session.get('landing_user_profile_id');

Template.mock_tests.events({
    'click .nextpri':function(){
        var quesId = Session.get('start_mock_test');
        var oldQues = Session.get('ques_detail');
        var ques1= quesId[parseInt(Session.get('nextitem'))];
        var selectedOpt = "-1";
        var status = 3;
        var marks = Session.get('marks');
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
            if($('input[name=options]:checked').attr('rel')=="true"){
                status = 0;
            } else {
                status = 1;
            }
        }
        
        quesArr = getFinalArr(ques1,selectedOpt,oldQues,quesArr,status);
        console.log(quesArr);
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
        var quesId = Session.get('start_mock_test');
        var oldQues = Session.get('ques_detail');
        var no = parseInt(Session.get('previtem'));
        var ques1= quesId[no];
        var selectedOpt = "-1";
        var status = 3;
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
            if($('input[name=options]:checked').attr('rel')=="true"){
                status = 0;
            } else {
                status = 1;
            }
        }
        
        quesArr = getFinalArr(ques1,selectedOpt,oldQues,quesArr,status);
        
        var ques = [];
        ques.push(quesId[no]);
        Meteor.call('getQuestions', ques, true, function(error, resultQues){
            Session.setTemp('ques_detail', resultQues);
            Session.setTemp('nextitem', no);
            Session.setTemp('previtem', no-1);
        });
    },
    'click .quesNo':function(event,template){
        var quesId = Session.get('start_mock_test');
        var oldQues = Session.get('ques_detail');
        var quesNo = event.currentTarget.id;
        var nos = quesNo.split('_');
            no = parseInt(nos[1]);
        var ques1= quesId[no];
        var selectedOpt = "-1";
        var status = 3;
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
            if($('input[name=options]:checked').attr('rel')=="true"){
                status = 0;
            } else {
                status = 1;
            }
        }
        
        quesArr = getFinalArr(ques1,selectedOpt,oldQues,quesArr,status);
        
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
        }else if(source=='course'){
            var bmsColour="light-green";
        }else if(source=='test'){
            var bmsColour="blue-bg";
        } else {
            var bmsColour="red-bg";
        }
        return bmsColour;
    }
});

Template.start_mock_test.helpers({
    'start_mock_test': function () {
        incQues=1;
        quesArr=[];
        testArr=[];
        optArr=[];
        start = new Date();
        user_id = Session.get('landing_user_profile_id');
        var arr = Session.get('start_mock_test');
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
        var arr = Session.get('start_mock_test');
        $.each(quesArr, function(i, n) {
            if(n.status===0 || n.status===1){
                if(jQuery.inArray(n.id,arr) !=-1){
                    var indx = jQuery.inArray(n.id,arr);
                    $('#ques_'+indx).addClass('colorskybl');   
                }
            }
        });
        var curQ = Session.setTemp('currQ',qn+1);
        $.each(quesArr, function(i, n) {
            if(parseInt(n.id)===parseInt(arr[qn])){
                $('#'+parseInt(n.selectedOptionid)).prop('checked', true);
                return false;
            }
            return true;
        });
        $('#ques_'+qn).addClass('colorgry');
        return qn+1;
    },
    'shouldBeDisabled':function(){
        var arr = Session.get('start_mock_test');
        if (Session.get('currQ') === arr.length) {
            $('#testN').hide();
            return {disabled: true};
        } else {
            $('#testN').show();
            return {};
        }
    },
    'timer':function(duration){
        clearInterval(t);
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
      arr = Session.get('start_mock_test');
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

Template.start_mock_test.rendered = function() {
    var parmsLen = Router.current().params;
    if(Object.keys(parmsLen).length==0){
            Router.go ('test_error',{},{query: 'source=course'});
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
            Session.setTemp('start_mock_test', result);
            Meteor.call('getQuestions', result, true, function(error, resultAllQues){
                var nArr = [];
                $.each(resultAllQues, function(i, n) {
                    newOptArr = [];
                    $.each(n.options, function(j, m) {
                        newOptArr.push(m.id);
                    });
                    nArr.push([n.id,newOptArr]);
                });
                Session.setTemp('finalArr',nArr);
            });
            var ques = [];
            ques.push(result[0]);
            Meteor.call('getQuestions', ques, true, function(error, resultQues){
                Session.setTemp('ques_detail', resultQues);
            });
        });
    } else {
        Router.go ('test_error',{},{query: 'source='+Session.get('source')});
    }
}



Template.start_mock_test.events({
    "click #confirmBoxMock" : function(e) {
        e.preventDefault();
        /*Get Last Selected Item Start*/
        var quesId = Session.get('start_mock_test');
        var oldQues = Session.get('ques_detail');
        var no = parseInt(Session.get('nextitem'));
        var ques1= quesId[no];
        var selectedOpt = "-1";
        var status = 3;
        if($('input[name=options]').is(':checked')){
            selectedOpt = $('input[name=options]:checked').val();
            if($('input[name=options]:checked').attr('rel')=="true"){
                status = 0;
            } else {
                status = 1;
            }
        }
        
        quesArr = getFinalArr(ques1,selectedOpt,oldQues,quesArr,status);
        
        /*Get Last Selected Item End*/
        var selectArr = [];
        $.each(quesArr, function(i, n) {
            selectArr.push(n.id);
        });
        
        var correctCount=0;
        var inCorrectCount=0;
        var marksObtained=0;
        var attemptCount=0;
        var unAttemptCount=0;
        var currentUserArr = [];
        var no=0;
        for(var i=0;i<quesId.length;i++){
            no++;
            if(jQuery.inArray(quesId[i],selectArr) == -1){
                var obj1 = {
                    "id" :quesId[i],
                    "marks" : Session.get('marks'),
                    "selectedOptionid" : "-1",
                    "status":"3",
                    "timetaken":0,
                    "quesNo":parseInt(quesArr.length)+1
                };
                
                /*-----------*/
                var attpArr={
                    'attp':'',
                    'skip':'Yes',
                    'qNo':parseInt(quesArr.length)+1
                }
                currentUserArr.push(attpArr);
                /*-----------*/
                quesArr.push(obj1);
                unAttemptCount+=1;
                attpArr={};
                obj1={};
            } else {
                var att=skip='';
                if(quesArr[i].status==0){
                    marksObtained += 1;
                    correctCount +=1;
                } else if(quesArr[i].status==1){
                    inCorrectCount +=1;
                }
                
                if(quesArr[i].selectedOptionid=="-1"){
                    skip='Yes';
                    unAttemptCount+=1;
                } else {
                    att = 'Yes';
                    attemptCount+=1;
                }
                /*-----------*/
                var attpArr={
                    'attp':att,
                    'skip':skip,
                    'qNo':quesArr[i].quesNo
                }
                currentUserArr.push(attpArr);
                attpArr={};
                /*-----------*/
            }
        }

        Meteor.setTimeout(function(){
            Session.setTemp('attempted',attemptCount);
            Session.setTemp('unAttempted',unAttemptCount);
            Session.setTemp('correctCount',correctCount);
            Session.setTemp('inCorrectCount',inCorrectCount);
            Session.setTemp('savedQuesArr',currentUserArr);
            Session.setTemp('marksObtained',marksObtained);
        },500);
        Modal.show('infoBoxMock');
    }
});

Template.infoBoxMock.helpers({
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

Template.infoBoxMock.events({
    'click #saveTestMock': function(event, template){
        Modal.hide('infoBoxMock');
        var testDetail = Session.get('testVal');
        
        var ttimetaken = ((new Date()-start)/1000);
        var jsonArr = {
            "testId":testDetail.test_id,
            "attemptedCount":Session.get('attempted'),
            "unattemptedCount":Session.get('unAttempted'),
            "totalTimeTaken":ttimetaken,
            "questions":quesArr,
            "correctCount":Session.get('correctCount'),
            "inCorrectCount":Session.get('inCorrectCount'),
            "marksObtained":Session.get('marksObtained')
        };
        
        if(user_id>0 && testDetail.test_id>0 && testDetail.chapterId>0){
            Meteor.call('saveUserTestWeb', user_id, testDetail.test_id, JSON.stringify(jsonArr), testDetail.chapterId, 'global',function(error, result){
                if(result.data.status){
                    Router.go('test_analysis', {tId:parseInt(testDetail.test_id)},{query: 'source='+Session.get('source')});
                } else {
                    Router.go ('test_error',{},{query: 'source='+Session.get('source')});
                }
            });
        } else {
            Router.go ('test_error',{},{query: 'source='+Session.get('source')});
        }
    },
    'click #cancelTestMock': function(event, template){
        Modal.hide('infoBoxMock');
    }
});

function getQuesOption(qId,finalArr){
    var opArr = [];
    $.each(finalArr, function(i, n) {
        if(parseInt(qId)===parseInt(n[0])){
            $.each(n[1], function(i, m) {
                opArr.push(parseInt(m));
            });
            return false;
        } else {
            return true;
        }
    });
    return opArr;
}

// ques1 for selected quesId
// selectedOpt for selected optionId
// oldQues for selected question Details
// status 0 for true 1 for false
// quesArr return final Array
function getFinalArr(qid,selId,oldArr,qArr,status){
    if(qArr.length>0){
        var opArr = [];
        $.each(Session.get('finalArr'), function(i, n) {
            if(qid==n[0]){
                $.each(n[1], function(i, m) {
                    opArr.push(m);
                });
                return false;
            }
            return true;
        });
        var found=0;
        $.each(qArr, function(i, n) {
            if(qid==n.id){
                found=1;
                var oplen = opArr.length;
                for(var j=0;j<oplen;j++){
                    if(opArr[j]==selId){
                        qArr[i].selectedOptionid=selId;
                        qArr[i].status=status;
                    }
                }
            }
        });
        
        if(found==0){
                var obj1 = {
                    "id" : oldArr[0].id,
                    "marks" : oldArr[0].question_marks, 
                    "selectedOptionid" : selId, 
                    "status" : status,
                    "quesNo" : Session.get('currQ'),
                    "timetaken" : 0
                };
                qArr.push(obj1);
                obj1={};
        }
    } else {
            var obj1 = {
                "id" : oldArr[0].id,
                "marks" : oldArr[0].question_marks, 
                "selectedOptionid" : selId, 
                "status" : status,
                "quesNo" : Session.get('currQ'),
                "timetaken" : 0
            };
            qArr.push(obj1);
            obj1={};
    }
    
    return qArr;
}

var t;
function timedCount(timedCounter){
    var hours =parseInt(timedCounter/3600)%24;
    var minutes =parseInt(timedCounter/60)%60;
    var seconds =timedCounter%60;
    var result = (hours<10?"0"+hours:hours)+":"+(minutes<10?"0"+minutes:minutes)+":"+(seconds<10?"0"+seconds:seconds);
    $('#timer').html(result);
    if(timedCounter==0){
        clearInterval(t);
        $('#prevN').hide();
        $('#testN').hide();
        $('#nextN').hide();
        Session.setTemp('timeUp','Yes');
        $( "#confirmBoxMock" ).trigger( "click" );
    } else {
        timedCounter=timedCounter-1;
        t = setTimeout(function(){ timedCount(timedCounter)},1000);   
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

Template.breadcrumb_test.helpers({
    'breadcumUrls':function(){
        var breadcumArr = [];
        var child = (Session.get('courseName')).replace(/ /g,"-").toLowerCase();
        child = (child).replace("---","-").toLowerCase();
        breadcumArr.push({'url':'/tests/'+child,'title':'Tests','showLink':true});
        if(Session.get('breadcrumb_name_course') !=''){
            var child1 = (Session.get('breadcrumb_name_course')).replace(/ /g,"-").toLowerCase();
            child1 = (child1).replace("---","-").toLowerCase();
            breadcumArr.push({'url':'/'+child1+'/tests/','title':Session.get('breadcrumb_name_course'),'showLink':true});
            
            if(Session.get('chapter_name') !=''){
                var child2 = (Session.get('chapter_name')).replace(/ /g,"-").toLowerCase();
                child2 = (child2).replace("---","-").toLowerCase();
                if(Session.get('source')=='course'){
                    breadcumArr.push({'url':'/'+child2+'/chapter_content_test/','title':Session.get('chapter_name'),'showLink':true});   
                } else {
                    breadcumArr.push({'url':'/'+child2+'/chapter_content/','title':Session.get('chapter_name'),'showLink':true});
                }
            }
        }
        var testName =  Session.get('testVal');
        breadcumArr.push({'url':'','title':testName.test_name,'showLink':false});
        return breadcumArr;
    }
});