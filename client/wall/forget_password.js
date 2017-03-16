Template.forget_password.onCreated(function () {
    Blaze._allowJavascriptUrls();
});


Template.forget_password_form.events({  
  'submit form': function (event, template) {
    event.preventDefault();
    var form = $(event.currentTarget);
    var passwordInput = form.find('.password-input').eq(0);
	var confirmPassword = form.find('.confirmPassword').eq(0);
	var password1 = passwordInput.val();
	var password2 = confirmPassword.val();
	
	if(password1.length < 6)
	{
		var message = "Your password must be at least 6 characters.";
		if(password1.length==''){
		var message = "Password is empty.";
		}
		toastr.warning(message);
		return;
	}
	if(password2.length < 6)
	{
		var message = "Your password must be at least 6 characters.";
		if(password2.length==''){
		var message = "Password is empty.";
		}
		toastr.warning(message);
		return;
	}
	if(password1 != password2)
	{
		var message = "Password and confirm password are not same.";
		toastr.warning(message);
		return;
	}
	var pathname = window.location.pathname.split("/");
	var emailVal = pathname[pathname.length-1];
	var parsedUrl = CryptoJS.enc.Base64.parse(emailVal);
	var parsedStr = parsedUrl.toString(CryptoJS.enc.Utf8);
	var res = parsedStr.split("#");
	var email=res[0];
            Meteor.call('reset_pass', password1,password2,email,function (error, result) {
				var data = JSON.parse(result.content);
				toastr.success(data.message);
				passwordInput.val('');
				confirmPassword.val('');
				if(data.status){
                                        ga('send', {
                                            hitType: 'event',
                                            eventCategory: 'forgot_password',
                                            eventAction: 'forgot_password_reset_successfully'
                                          });
					$("#forget_password_form").hide();
					$("#iprofLink").show();
				}
            });
  }
});