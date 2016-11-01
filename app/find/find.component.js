angular.module('find').component('find', {
  templateUrl: 'find/find.template.html',
  controller: function FindController($scope) {

    // Instantiate the book object
    $scope.book = {};
    $scope.book.name = "hello";

  }
});
