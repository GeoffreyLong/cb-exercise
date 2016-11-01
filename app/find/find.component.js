angular.module('find').component('find', {
  templateUrl: 'find/find.template.html',
  controller: function FindController($scope, $http) {

    // Instantiate the book object
    $scope.book = {};

    // Function runs when the input button is clicked
    $scope.findBooks = function() {
      var bookName = $scope.book.name;
      // console.log(processBookName(bookName));
      $http({
        url: '/find',
        method: 'GET',
        params: {book: bookName}
      }).then(function(data) {
        console.log(data);
      }, function(err) {
        console.log(err);
      });
    }

    /*
    // Function takes the string book name and checks for correctness
    var processBookName = function(bookName) {
      var re = new RegExp("");
      return bookName.match(/^ISBN:[0-9]{10}$|^ISBN:[0-9]{13}$|/);
    }
    */
  }
});
