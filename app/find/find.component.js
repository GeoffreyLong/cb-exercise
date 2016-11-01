angular.module('find').component('find', {
  templateUrl: 'find/find.template.html',
  controller: function FindController($scope, $http) {

    // Instantiate the book query object
    $scope.bookQuery = {};

    // Instantiate the books object
    $scope.books = null;

    // Function runs when the input button is clicked
    $scope.findBooks = function() {
      var bookName = $scope.bookQuery.name;
      // console.log(processBookName(bookName));
      $http({
        url: '/find',
        method: 'GET',
        params: {book: bookName}
      }).then(function(bookData) {
        var book = bookData.data;
        console.log(bookData.data);
        if (bookData) {
          $scope.books = bookData.data;
        }
        else {
          alert("Please check the format of your query: " + bookName);
        }
      }, function(err) {
        console.log(err);
        alert("There was an error: " + err);
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
