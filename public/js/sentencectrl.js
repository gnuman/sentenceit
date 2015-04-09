angular.module('SentenceCtrl', []).controller('SentenceController', function($scope,$http) {

    $scope.options = [
	{ label: 'Marathi', value: 'mr' },
	{ label: 'Bengali', value: 'bn' },
	{ label: 'Gujarati', value: 'gu' }
    ];
    $scope.langSelected = $scope.options[0];
    $scope.hasResults = false;
    var SENTENCE_URL = 'http://sentenceit-i18n.itos.redhat.com/sentences?';
    
    $scope.search = function (){
	/*
	var keywords = [];
	$scope.q.split(' ').forEach(function (v) {
            keywords.push(v);
        });
	*/
	var lang_cond = 'lang='+$scope.langSelected.value+'&';
	var word_cond = 'word='+$scope.q;
	$http.get(SENTENCE_URL+lang_cond+word_cond).then(function (res) {
	    /*
	    if(res.status!= '200'){
		return false;
	    }*/

	    $scope.hasResults = true;
	    $scope.results = res.data.sentences;
	});
    };
});



angular.module('LanguageCtrl', []).controller('LanguageController', function($scope,$http) {
    

});



