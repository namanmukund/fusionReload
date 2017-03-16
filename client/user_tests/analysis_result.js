Template.analysis_result.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Session.setTemp('nextitemA', 0);
Session.setTemp('previtemA', 0);
user_id = Session.get('landing_user_profile_id');
Template.analysis_result.rendered = function() {
    var parmsLen = Router.current().params;
    if(Object.keys(parmsLen).length==0){
        Router.go ('test_error',{},{query: 'source=course'});
    } else {
        if(parmsLen.tId==0 || parmsLen.tId=='' || user_id==0 || user_id==''){
            if(typeof parmsLen.query.source =='undefined'){
                Router.go ('test_error',{},{query: 'source=course'});
            } else {
                Router.go ('test_error',{},{query: 'source='+parmsLen.query.source});
            }
        }
        
    }
    
    var test_ids = Router.current().params.tId;
    
    if(test_ids>0 && user_id>0){
        Meteor.call('webTestDetails', parseInt(test_ids), function(error, testDetails){
            console.log('res',testDetails);
            Session.set('test_detail', testDetails);
        });
        Meteor.call('getTestAnalysisDetailsWeb', parseInt(user_id), parseInt(test_ids), 'global', function(error, result){
            console.log('resultTest',result);
            var allQuesIds = [];
            $.each(result.data.result_data.questions, function(i, n) {
                allQuesIds.push(n.id+'_'+n.question_attempt_status);
            });
            Session.setTemp('analysis_result', result.data.result_data);
            Session.setTemp('question', result.data.result_data.questions[0]);
            correctExp(result.data.result_data.questions[0]);
            Session.setTemp('allQues',allQuesIds);
            Session.setTemp('total_question', (result.data.result_data.questions).length);
        });
    }
    
}

Template.analysis_result.events({
   'click .nextpri':function(){
        var allRes = Session.get('analysis_result');
        var ques = allRes.questions;
        var no = parseInt(Session.get('nextitemA'))+1;
        Session.setTemp('question', ques[no]);
        Session.setTemp('nextitemA', no);
        Session.setTemp('previtemA', no-1);
        correctExp(ques[no]);
    },
    'click .priitem':function(){
        var allRes = Session.get('analysis_result');
        var ques = allRes.questions;
        var no = parseInt(Session.get('previtemA'));
        Session.setTemp('question', ques[no]);
        Session.setTemp('nextitemA', no);
        Session.setTemp('previtemA', no-1);
        correctExp(ques[no]);
    },
    'click .quesNo':function(event,template){
        var allRes = Session.get('analysis_result');
        var ques = allRes.questions;
        var no = event.currentTarget.id;
        Session.setTemp('question', ques[no]);
        Session.setTemp('nextitemA', no);
        Session.setTemp('previtemA', no);
        correctExp(ques[no]);
    } 
});

Template.analysis_result.helpers({
    'result':function(){
        var anaRes = Session.get('analysis_result');
        if(anaRes){
            return anaRes;   
        }
    },
    'allques':function(){
        incAnalysis=1;
        var arr = Session.get('allQues');
        return _.map(arr, function(val, index) {
            var v=val.split('_');
            return {index: index, value: v[0],attempt:v[1]};
        });
    },
    'questionDet':function(){
        var qs = Session.get('question');
        if(qs){
            return Session.get('question');   
        } else {
            return '';
        }
    },
    'totalQuestion':function(){
        var tq = Session.get('total_question');
        if(tq){
            return Session.get('total_question');   
        } else {
            return '';
        }
    },
    'incrementQuesA':function(){
        return incAnalysis++;
    },
    'test_result':function(){
        return Session.get('test_detail');
    },
    'nextitem':function(){
        return Session.get('nextitemA');
    },
    'qNoA':function(){
        var curQ = Session.setTemp('currQA',parseInt(Session.get('nextitemA'))+1);
        return parseInt(Session.get('nextitemA'))+1;
    },
    'rightOption':function(right){
        return right===true;
    },
    'corrOpt':function(selected){
        return selected===true;
    },
    'wrongOpt':function(selected){
        return selected===true;
    },
    'durations':function(duration){
        if(duration>0){
            return moment().startOf('day').seconds(duration).format('H:mm:ss');   
        } else {
            return '00:00:00';
        }
    },
    'shouldBeDisabled':function(){
        var arr = Session.get('total_question');
        if (parseInt(Session.get('currQA')) === parseInt(arr)) {
            $('#analysisbtn').hide();
            return {disabled: true};
        } else {
            $('#analysisbtn').show();
            return {};
        }
    },
    'selcolor':function(attempt){
        if(attempt==0){
            return "colorskybl";
        } else if(attempt==1) {
            return "colorgry";
        } else {
            return "";
        }
    },
    'loadScript':function(q){
        if(q>0){
            return true;   
        } else {
            return false;
        }
    },
    'attempted':function(q){
        if(q==0 || q==1){
            return true;
        } else {
            return false;
        }
    }
});

function correctExp(ques){
    var cExp='';
    $.each(ques.options, function(i, n) {
        if(n.right_options===true){
            cExp=n.explanation;
            return false;
        } else {
            return true;
        }
    });
    $('#reviewq').html(cExp);
}