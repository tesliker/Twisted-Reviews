(function(){
  var troutPro = angular.module('troutPro', ['ngRoute', 'angular-gestures']);

    troutPro.config(function($routeProvider, hammerDefaultOptsProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });
            hammerDefaultOptsProvider.set({
                recognizers: [[Hammer.Swipe, {time: 500}]],
                touchAction: 'pan-y'
            });
    });

    // create the controller and inject Angular's $scope
    troutPro.controller('mainController', function($timeout, $scope, $http) {

        $scope.questionCount = 0;

        $scope.addQuestionCount = function() {
         $scope.questionCount = $scope.questionCount + 1; 
        $(window).scrollTop(75);
        }

        $scope.subtractQuestionCount = function() {
         $scope.questionCount = $scope.questionCount - 1;
         $(window).scrollTop(75);
        }

        $scope.$watch('questionCount', function(newValue, oldValue) {
            if (newValue === $scope.nodes.length) {
            var total = 0;
            var totalCorrect = 0;
            $('.streams-list-wrapper').each(function() {
              total = total + 1;
              if ($(this).find('.disabled .col-sm-3.correct').length > 0) {
                totalCorrect = totalCorrect + 1;
              }
            });
            $('.result-count').text(totalCorrect + ' out of ' + total);
            }
        });

        $http.get('http://guessreview.dv1.info/quiz/api').
        
        success(function(data, status, headers, config){
          $(data).each(function(key, val){
            var markup = '<div class="sort">' + data[key]['field_possible_answers'] + '<div class="col-sm-3 list-item"><div class="node-photo"><div data-quickedit-field-id="node/18/field_photo/en/full" class="field field--name-field-photo field--type-image field--label-hidden field__item"><img src="' + data[key]['field_photo'] + '"></div></div><h4 class="node-title" data-nid="' + data[key]['nid'] + '">' + data[key]['title'] + '</h4></div></div>';
            var parent = $(markup);
            var divs = parent.children();
            while (divs.length) {
                parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
            }
            data[key]['field_possible_answers'] = parent.html();

          });
          $scope.nodes = data;

        });

    });

    troutPro.controller('aboutController', function($scope, $http) {
        $http.get('http://guessreview.dv1.info/quiz/api').
        
        success(function(data, status, headers, config){
          $scope.nodes = data;
        });

    });

    troutPro.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });

    troutPro.filter('rawHtml', ['$sce', function($sce){
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }]);

troutPro.directive('finishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          $('.col-sm-3.list-item').click(function(){
            if (!$(this).parent().hasClass('disabled')) {
                if ($(this).children('h4').attr('data-nid') === $(this).parent().parent().siblings('.quote').attr('data-nid')) {
                  $(this).addClass('correct');
                  $(this).append('<div class="btn btn-primary">Correct!</div>');
                  $(this).parent().addClass('disabled');
                }
                else {
                  $(this).addClass('incorrect');
                  $(this).append('<div class="btn btn-danger">Incorrect!</div>');
                  $(this).siblings().each(function(){
                    if ($(this).children('h4').attr('data-nid') === $(this).parent().parent().siblings('.quote').attr('data-nid')) {
                        $(this).append('<div class="btn btn-warning">Correct!</div>');  
                        $(this).parent().addClass('disabled');                  
                    }
                  });
                }
            }
          });
        });
      }
    }
  }
});
  
})();