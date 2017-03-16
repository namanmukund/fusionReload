Template.bmsSubjectBreadcrumb.events({
    'click .bmsSubject': function (event) {
        Router.go('/landing/bmsSubject');
         // window.location.href = '/bmsSelectSubject';
    },
     'click .bmsOpponent': function (event) {
        Router.go('/landing/bmsSubject/bmsOpponent');
         // window.location.href = '/bmsSelectSubject';
    }
});

Template.bmsOpponentBreadcrumb.events({
    'click .bmsSubject': function (event) {
        Router.go('/landing/bmsSubject');
         // window.location.href = '/bmsSelectSubject';
    },
     'click .bmsOpponent': function (event) {
        Router.go('/landing/bmsSubject/bmsOpponent');
         // window.location.href = '/bmsSelectSubject';
    }
});