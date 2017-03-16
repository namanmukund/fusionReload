Template.contactus.onRendered(function(){
    $('#contactUsform').validate({
        rules: {
            cName: {
                required: true
            },
            cEmail: {
                required: true
            },
            cPhone: {
                required: true,
                digits: true,
                rangelength: [10,10]
            },
            cInterest: {
                required: true
            }
        },
        messages: {
            cName: {
                required: "You must enter your name."
            },
            cEmail: {
                required: "You must enter your email."
            },
            cphone: {
                required: "You must enter your phone.",
                digits: "You must enter digits only",
                rangelength: "Your phone should have 10 characters."
            },
            cInterest: {
                required: "You must select interest."
            }
        }
    });
});

Template.contactus.events({
    'change #cInterest':function(evt){
        var interestVal = $(evt.target).val();
        if(interestVal=='Give us feedback'){
            $('#feedboxBox').show();
        } else {
            $('#feedboxBox').hide();
        }
    },
    'click #submitContact':function(e){
        $('#message').text('');
        e.preventDefault();
        var cName = $('#cName').val();
        var cEmail = $('#cEmail').val();
        var cPhone = $('#cPhone').val();
        var cInterest = $('#cInterest').val();
        if($.trim(cName)=='' || $.trim(cEmail)=='' || $.trim(cPhone)=='' || $.trim(cInterest)==''){
            $('#message').css('color','red');
            $('#message').text('Please fill all details in proper formats!');
        } else {
            var sub=1;
            if($.trim(cInterest)=='Give us feedback'){
                if($.trim($('#cFeedback').val())==''){
                    sub=0;
                }
            }
            
            if(sub==1){
                var content  = 'Dear Admin,<br/> A user has contacted you, please find below details';
                content += '<br/>Name : '+cName;
                content += '<br/>Email : '+cEmail;
                content += '<br/>Phone : '+cPhone;
                content += '<br/>Intered in : '+cInterest;
                if(cInterest=='Give us feedback'){
                    cFeedback = $('#cFeedback').val();
                    content += '<br/>Feedback : '+cFeedback;
                }
                content +=  '<br/>Thanks & Regards<br/>Iprof India';
    
                Meteor.call('contactUsFormWeb', content, function (error, result) {
                    console.log(result);
                    if(result.status==true){
                        $('#message').css('color','green');
                        $('#message').text(result.message);
                    } else {
                        $('#message').css('color','red');
                        $('#message').text('Error while sending mesage!');
                    }
                });
            } else {
                $('#message').css('color','red');
                $('#message').text('Please fill feedback!');
            }
        }
    }
});
