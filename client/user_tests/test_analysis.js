Template.test_analysis.onCreated(function() {
    Blaze._allowJavascriptUrls();
});


user_id = Session.get('landing_user_profile_id');

Template.test_analysis.rendered = function() {
    var parmsLen = Router.current().params.query;
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
    var source = Router.current().params.query.source;
    Session.setTemp('source',source);
    
    Session.setTemp('test_id',test_ids);
    Meteor.call('getTestAnalysisDetailsWeb', parseInt(user_id), parseInt(test_ids), 'global', function(error, result){
        Session.setTemp('analysis_result', result.data.result_data);
        Session.setTemp('total_question', (result.data.result_data.questions).length);
        Session.setTemp('test_detail', test_detail);
    });
}

Template.test_analysis.helpers({
    'user_test_detail': function () {
        return Session.get('analysis_result');
    },
    'totalQuestion':function(){
        return Session.get('total_question');
    },
    'duration':function(duration){
        if(duration>0){
            return moment().startOf('day').seconds(duration).format('H:mm:ss');   
        } else {
            return '00:00:00';
        }
    },
    'graph':function(total,exp){
        return ((exp/total)*100);
    },
    'user_id':function(){
        return user_id;
    },
    'test_id':function(){
        return Session.get('test_id');
    },
    'headerSource':function(){
        return Session.get('source');
    }
});

Template.test_analysis.events({
    'click #analysisResult': function(event, template){
    }
});