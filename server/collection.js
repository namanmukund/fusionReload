    Preferences = new Mongo.Collection('preferences');
    Courses = new Mongo.Collection('courses');
    //Users = new Mongo.Collection('Users');
    Packages = new Mongo.Collection('packages');
    //QuestionMasters = new Mongo.Collection('questions_naman');
    QuestionMasters = new Mongo.Collection('question_masters');
    Funzone = new Mongo.Collection('funzone');
    TokenDetails = new Mongo.Collection('token_details');
    Users = new Mongo.Collection('users_collection');
    AttemptedTests = new Mongo.Collection('attempted_tests');
    PreferenceSelection = new Mongo.Collection('preference_collection');

    QdQwTransactions=new Mongo.Collection('qd_qw_transactions');
	Subscriptions = new Mongo.Collection('subscriptions');

    Otp = new Mongo.Collection('otp');
	Notifications = new Mongo.Collection('notifications');
	Bms = new Mongo.Collection('bms');
	ApiUserFeedback = new Mongo.Collection('api_user_feedback');
	
	UserPackageActivation = new Mongo.Collection('user_package_activation');
	

    TestsCollection=new Mongo.Collection('tests_collection');
    
    CoursesMetaInfo=new Mongo.Collection('courses_meta_info');
    Pincode = new Mongo.Collection('ServiceablePinCode');

    ContentPartners = new Mongo.Collection('content_partners');



     //  UserAppActivityLog = new Mongo.Collection('user_app_activity_log');
   // GlobalAppInstallationLog = new Mongo.Collection('global_app_installation_log');
   // UserLocationLog = new Mongo.Collection('user_location_log');