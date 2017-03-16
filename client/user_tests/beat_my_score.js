Template.beat_my_score.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

user_id = Session.get('landing_user_profile_id');

Template.beat_score.rendered = function() {
    var result = Session.get('resultChallanger');
    var oldUserArr = [];
    if(typeof result !='undefined'){
        $.each(result.questionList, function(i,q) {
            var crText = 'Incorrect';
            var att=skip='';
            if(q.selectedAnswer=="-1"){
                skip='Yes';
            } else {
                att = 'Yes';
            }
            if(q.selectedAnswer==q.correctAnswer){
                crText='Correct';
            }
            
            var crOptionText = '';
            $.each(q.options, function(j, op) {
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
            var attpArr={
                'attp':att,
                'skip':skip,
                'qNo':q.questionNumber,
                'corrAns':crOptionText,
                'corrStatus':crText
            }
            oldUserArr.push(attpArr);
        });
        Session.setTemp('oldScore',result.challengerMarks);
        Session.setTemp('oldUsername',result.challengerUserName);
        Session.setTemp('oldUserImg',result.challengerImageURL);
    } else {
        Session.setTemp('oldScore',0);
        Session.setTemp('oldUsername','');
        Session.setTemp('oldUserImg','bmsCircle.png');
    }
    Session.setTemp('oldUserArr',oldUserArr);
}

Template.beat_score.helpers({
    'currentUser':function (){
        return Session.get('currentUserQues');
    },
    'currentScore':function(){
        return Session.get('currentUserScore');
    },
    'currentUserName':function(){
        return Session.get('landing_user_profile_name');
    },
    'imgNewUrl':function(){
        return 'bmsCircle.png';
    },
    'colorNewText':function(status){
        if(status=='Correct'){
            return 'text-success';
        } else {
            return 'text-danger';
        }
    },
    'userS':function(){
        var cQ = Session.get('currentUserQues').length;
        var cS = Session.get('currentUserScore');
        var ctS = (cS*100)/cQ;
        return ctS;
    },
    'oldUser':function(){
        return Session.get('oldUserArr');
    },
    'oldScore':function(){
        return Session.get('oldScore');
    },
    'oldUserName':function(){
        return Session.get('oldUsername');   
    },
    'imgOldUrl':function(){
        return Session.get('oldUserImg');
    },
    'colorOldText':function(status){
        if(status=='Correct'){
            return 'text-success';
        } else {
            return 'text-danger';
        }
    },
    'oldS':function(){
        //var oQ = Session.get('oldUserArr').length;
        //var oS = parseInt(Session.get('oldScore'));
        var oQ = 10;
        var oS = 1;
        if(oQ==0 && oS==0){
            return 0;
        } else {
            var otS = (oS*100)/oQ;
            return otS;
        }
    },
    'getHigest':function(cS, oS, sec){
        if(sec==1){
            if(parseInt(cS)>parseInt(oS)){
                return 'progress-bar-success';
            } else {
                return 'progress-bar-danger';
            }   
        } else {
            if(parseInt(oS)>parseInt(cS)){
                return 'progress-bar-success';
            } else {
                return 'progress-bar-danger';
            }
        }
    },
    'wonTitle':function(cS, oS, sec){
        if(Session.get('oldUserArr').length>0){
            if(sec==1){
                if(parseInt(cS)>parseInt(oS)){
                    return 'You Won!';
                } else {
                    return '';
                }   
            } else {
                if(parseInt(oS)>parseInt(cS)){
                    return 'You Won!';
                } else {
                    return '';
                }
            }   
        } else {
            return '';
        }
    }
});

Template.headertest.helpers({
    'bmsColour': function () {
        var source = Router.current().params.query.source;
        console.log("source",source);
        if(source=='bms'){
           var bmsColour="bms-bg";
        }else{
            var bmsColour="blue-bg";
        }
        return bmsColour;
    }
});

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
