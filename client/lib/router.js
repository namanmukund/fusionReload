Router.configure({
  // defaultBreadcrumbTitle: 'My Default Title',
  progressSpinner : false,
  // progressDelay : 10,
  progressDebug:true,
  
  // progressDelay:true,
  defaultBreadcrumbLastLink: false
});
/*************** Static pages ****************************/
Router.route('/about-us/', {
    template: 'pageaboutus',
    title: 'About iProf'
});
Router.route('/board-of-directors/', {
    template: 'pageboardofdirectors',
    title: 'iProf Board of Directors'
});
Router.route('/careers/', {
    template: 'pagecareers',
    title: 'iProf - Career, Latest Jobs Opening, Vacancies'
});
Router.route('/contact-us/', {
    template: 'pagecontactus',
    title: 'Contact iProf'
});
Router.route('/faqs/', {
    template: 'pagefaqs',
    title: 'iProf'
});
Router.route('/investors/', {
    template: 'pageinvestors',
    title: 'iProf Investors'
});
Router.route('/privacy-policy/', {
    template: 'pageprivacypolicy',
    title: 'Privacy Policy'
});
Router.route('/team-iprof/', {
    template: 'pageteamiprof',
    title: 'Team iProf'
});
Router.route('/terms-and-conditions/', {
    template: 'pagetermsandconditions',
    title: 'Terms and Conditions'
});
Router.route('/help/', {
    template: 'pagehelp',
    title: 'iProf'
});
Router.route('/track-order/', {
    template: 'pagetrackorder',
    title: 'iProf'
});
Router.route('/content-partnerships/', {
    template: 'pagecontentpartnerships',
    title: 'iProf'
});


Router.route('/deals/', {
    template: 'dealspage',
    title: 'About iProf'
});

Router.route('/wall/funzone', function () {
  this.render('funzone');
});

Router.route('/quiz', function () {
  this.render('quiz');
});

Router.route('/trending_course', function () {
  this.render('trending_course');
});

Router.route('/trending_test', function () {
  this.render('trending_test');
});

Router.route('/user_wall', function () {
  this.render('user_wall');
});

Router.route('/search', function () {
  this.render('search');
});

Router.route('/subscription/plan', function () {
  this.render('subscription');
});

Router.route('/course_listing', function () {
  this.render('course_listing');
});

Router.route('/cart/list', function () {
  this.render('cart_body');
});

Router.route('Payments/success', function () {
  this.render('success');
});

Router.route('Payments/failure', function () {
  this.render('failure');
});

Router.route('/content_partner', function () {
  this.render('content_partner');
});

Router.route('/subscriptionExpired', function () {
  this.render('subscriptionExpired');
});

Router.route('/my_downloads', function () {
  this.render('my_downloads');
});

Router.route('/express_checkout/go', function () {
  this.render('express_checkout');
});

Router.route('/landing/bmsSubject', {
  name: 'landing.bmsSubject',
  template: 'bmsSubject',
  parent: 'landing', // this should be the name variable of the parent route
  title: 'Beat My Score'
  // showLink: false // will not link this item in the breadcrumb ever
});

Router.map(function() {
  return this.route('/my_course', {
  name: 'my_course',
  template: 'my_course',
  onBeforeAction:function(){
      $('#mask1').show();
      SEO.set({
	title: 'iProf: My Courses',
	meta: {
	  'description': 'iProf: My Courses',
	  'keywords': 'iProf: My Courses'
	}
      });
      this.next();
  },
  onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/tutors', {
  name: 'tutors',
  template: 'tutors',
  onBeforeAction:function(){
      $('#mask1').show();
      SEO.set({
	title: 'iProf: Tutor',
	meta: {
	  'description': 'iProf: Tutor',
	  'keywords': 'iProf: Tutor'
	}
      });
      this.next();
  },
  onAfterAction: function() {
    $('#mask1').hide();
  }
  });
});

Router.map(function() {
  return this.route('/my_purchases', {
  name: 'my_purchases',
  template: 'my_purchases',
  onBeforeAction:function(){
      $('#mask1').show();
      SEO.set({
	title: 'iProf: My Purchases',
	meta: {
	  'description': 'iProf: My Purchases',
	  'keywords': 'iProf: My Purchases'
	}
      });
      this.next();
  },
  onAfterAction: function() {
    $('#mask1').hide();
  }
  });
});

Router.map(function() {
  return this.route('/test_error', {
    name: 'test_error',
    template: 'test_error',
    onBeforeAction:function(){
	SEO.set({
	  title: 'iProf: Ooops Test Error',
	  meta: {
	    'description': 'iProf: Ooops Test Error',
	    'keywords': 'iProf: Ooops Test Error'
	  }
	});
	this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/my_purchased_test_series', {
  name: 'my_purchased_tests',
  template: 'my_purchased_tests',
  onBeforeAction:function(){
      $('#mask1').show();
      SEO.set({
	title: 'iProf: My Purchased Test Series',
	meta: {
	  'description': 'iProf: My Purchased Test Series',
	  'keywords': 'iProf: My Purchased Test Series'
	}
      });
      this.next();
  },
  onAfterAction: function() {
    $('#mask1').hide();
  }
  });
});

Router.map(function() {
  return this.route('/my_test_series', {
  name: 'my_test',
  template: 'my_test',
  onBeforeAction:function(){
    $('#mask1').show();  
    SEO.set({
      title: 'iProf: My Test Series',
      meta: {
	'description': 'iProf: My Test Series',
	'keywords': 'iProf: My Test Series'
      }
    });
    this.next();
  },
  onAfterAction: function() {
      $('#mask1').hide();
  }
  });
});

Router.map(function() {
  return this.route('/courses/:slug', {
    name: 'courses',
    onBeforeAction:function(){
      $('#mask1').show();
      this.next();
    },
    onAfterAction: function() {
      SEO.set({
	  title: Session.get('metaInfo').title,
	  meta: {
	    'description': Session.get('metaInfo').description,
	    'keywords': Session.get('metaInfo').keywords
	  }
	});
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/test_analysis/:tId', {
  name: 'test_analysis',
  template: 'test_analysis',
  onBeforeAction:function(){
      $('#mask1').show();  
      SEO.set({
	title: 'iProf: Test Analysis',
	meta: {
	  'description': 'iProf: Test Analysis',
	  'keywords': 'iProf: Test Analysis'
	}
      });
      this.next();
  },
  onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/analysis_result/:tId', {
  name: 'tests.analysis_result',
  template: 'analysis_result',
  parent: 'tests', // this should be the name variable of the parent route
  title: 'Tests Analysis',
  onBeforeAction:function(){
      $('#mask1').show();  
      SEO.set({
	title: 'iProf: Test Analysis Result',
	meta: {
	  'description': 'iProf: Test Analysis Result',
	  'keywords': 'iProf: Test Analysis Result'
	}
      });
      this.next();
  },
  onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('tests/:slug', {
    name: 'tests',
    template: 'tests_page',
    parent:'',
    title: 'Tests',
    onBeforeAction:function(){
      $('#mask1').show();    
      this.next();
    },
    onAfterAction: function() {
      SEO.set({
	title: Session.get('metaInfo').title,
	meta: {
	  'description': Session.get('metaInfo').description,
	  'keywords': Session.get('metaInfo').keywords
	}
      });
      $('#mask1').hide();
    }
  });
});

// Router.map(function() {
//   return this.route('/:slug/chapter_content/', {
//     name: 'tests.test_pdp.chapter_content',
//     template: 'chapter_content',
//     parent: 'tests.test_pdp',
//     title: Session.get('chapter_name'),
//     onBeforeAction:function(){
//       $('#mask1').show();    
//       this.next();
//     },
//     onAfterAction: function() {
//       $('#mask1').hide();
//       SEO.set({
// 	title: Session.get('metaInfo').title,
// 	meta: {
// 	  'description': Session.get('metaInfo').description,
// 	  'keywords': Session.get('metaInfo').keywords
// 	}
//       });
//     }
//   });
// });

// Router.map(function() {
//   return this.route('/:slug/chapter_content_test/', {
//     name: 'tests.test_pdp.chapter_content_test',
//     template: 'chapter_content_test',
//     parent: 'tests.test_pdp',
//     title: Session.get('chapter_name'),
//     onBeforeAction:function(){
//       $('#mask1').show();    
//       this.next();
//     },
//     onAfterAction: function() {
//       SEO.set({
// 	title: Session.get('metaInfo').title,
// 	meta: {
// 	  'description': Session.get('metaInfo').description,
// 	  'keywords': Session.get('metaInfo').keywords
// 	}
//       });
//       $('#mask1').hide();
//     }
//   });
// });

Router.route('/forget_password/:_id', function () {
  var params = this.params;
  var id = params._id;
  this.render('forget_password');
});

Router.route('/subscription_plan/:_id', function () {
  var params = this.params;
  var id = params._id;
  Session.set('validityId_from_pricing_subscription',id);
  this.render('subscription');
});

Router.map(function() {
  return this.route('/beatMyScore/:tId', {
    name: 'beat_my_score',
    template: 'beat_my_score',
    onBeforeAction:function(){
      $('#mask1').show();    
      SEO.set({
	title: 'iProf: Beat My Score',
	meta: {
	  'description': 'iProf: Beat My Score',
	  'keywords': 'iProf: Beat My Score'
	}
      });
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

/********************************************/
Router.route('/', {
  name: 'landing',
  template: 'landing',
  title: 'home',
  onBeforeAction:function(){
      $('#mask1').show();
      this.next();
    },
  onAfterAction: function() {
      $('#mask1').hide();
    }
});

Router.route('/landing/bmsSubject/bmsOpponent/', {
  name: 'bmsOpponent',
  template: 'bmsOpponent',
  parent: 'landing', // this should be the name variable of the parent route
  title: 'Beat My Score'
  // showLink: false // will not link this item in the breadcrumb ever
});

Router.map(function() {
  return this.route('about', {
    path: '/:urlstr/about',
    action: function(){
    Session.setTemp('url_str',this.params.urlstr);
    this.render();
  }
  });
});


Router.route('/:slug/', {
  template: 'landing',
  title: 'home',
  onBeforeAction:function(){
    this.next();
  },
  onAfterAction: function() {
    Router.go('/');
  }
});

Router.map(function() {
  return this.route('/:slug/:id', {
    name: 'wall',
    onBeforeAction:function(){
      $('#mask1').show();  
      var gradeId = parseInt(this.params.id);
      Meteor.call('CoursesMetaInfo', gradeId, function (error, result) {
	var gId = Session.get('global_grade_id');
	if(typeof gId =='undefined'){
	  Session.set('global_grade_id',gradeId);
	}
	SEO.set({
	  title: result.title,
	  meta: {
	    'description': result.description,
	    'keywords': result.keywords
	  }
	});
      });
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/user_tests/:tId/:cId', {
    name: (Session.get('source')=='course')?'tests.test_pdp.chapter_content.user_tests':'tests.test_pdp.chapter_content.user_tests',
    template: 'mock_tests',
    parent: (Session.get('source')=='course')?'tests.test_pdp.chapter_content_test':'tests.test_pdp.chapter_content', // this should be the name variable of the parent route
    title:'Start Test',
    onBeforeAction:function(){
      $('#mask1').show();  
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
      SEO.set({
	title: Session.get('metaInfo').title,
	meta: {
	  'description': Session.get('metaInfo').description,
	  'keywords': Session.get('metaInfo').keywords
	}
      });
    }
  });
});


Router.map(function() {
  return this.route('/bmsTests/:tId/:cId', {
    name: 'bmsTests',
    template: 'bms_tests',
    parent: 'landing',
    title: 'Beat My Score',
    onBeforeAction:function(){
      $('#mask1').show();  
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
      SEO.set({
	title: Session.get('metaInfo').title,
	meta: {
	  'description': Session.get('metaInfo').description,
	  'keywords': Session.get('metaInfo').keywords
	}
      });
    }
  });
});

Router.map(function() {
  return this.route('/:slug/tutorials/:id/', {
    name: 'pdp',
    onBeforeAction:function(){
      Session.set('pckg_id',parseInt(this.params.id));
      this.next();
    },
    onBeforeAction:function(){
      $('#mask1').show();  
      var pid = parseInt(this.params.id);
      Session.set('pckg_id',pid);
      Meteor.call('fetchCourseDataFromPckgId', pid, function (error, result) {
	var gId = Session.get('global_grade_id');
	if(typeof gId =='undefined'){
	  Session.set('global_grade_id',result.package_program.course[0].id);
	}
	SEO.set({
	  title: result.meta_title,
	  meta: {
	    'description': result.meta_desc,
	    'keywords': result.keyword
	  }
	});
      });
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

Router.map(function() {
  return this.route('/:slug/tests/:id/', {
    name: 'tests.test_pdp',
    template: 'test_pdp_page',
    parent: 'tests',
    title: Session.get('breadcrumb_name_course'),
    onBeforeAction:function(){
      $('#mask1').show();  
      var pid = parseInt(this.params.id);
      Session.set('pckg_id',pid);
      Meteor.call('fetchCourseDataFromPckgId', pid, function (error, result) {
	var gId = Session.get('global_grade_id');
	if(typeof gId =='undefined'){
	  Session.set('global_grade_id',result.package_program.course[0].id);
	}
	SEO.set({
	  title: result.meta_title,
	  meta: {
	    'description': result.meta_desc,
	    'keywords': result.keyword
	  }
	});
      });
      this.next();
    },
    onAfterAction: function() {
      $('#mask1').hide();
    }
  });
});

// register a iron router template helper to check if the route is active
UI.registerHelper('isActiveRoute', function(routeName) {
    var currentRoute = Router.current();
    return currentRoute && routeName === currentRoute.route.getName() ? 'active' : '';
});
