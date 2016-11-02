angular.module('find').component('find', {
  templateUrl: 'find/find.template.html',
  controller: function FindController($scope, $http) {

    // Instantiate the book query object
    $scope.bookQuery = {};

    // Instantiate the books object
    $scope.books = null;

    // Function runs when the input button is clicked
    $scope.findBooks = function() {
      var bookString = $scope.bookQuery.string;
      var processedQueryString = processBookNames(bookString);
      console.log(processedQueryString);

      // Only run the API query with a valid string
      if (processedQueryString != null) {
        queryAPI(processedQueryString);
      }
    }

    // Function takes the string book name and checks for correctness
    // This is based on the common formats for ISBN and LCCN numbers
    // ISBN is a string of 10 or 13 numbers
    // LCCN is slightly more complicated
    var processBookNames = function(bookNames) {
      // I shouldn't care if ISBN or LCCN are lower case
      var lowerBookNames = bookNames.toLowerCase();
      var queryString = "";

      lowerBookNames.split(',').forEach(function(token) {
        // Remove the white space
        var processedString = token.trim();
        
        // If the token is in a valid format then add it to the query string
        // Else alert the user and return null
        if (processedString.match(/^isbn:[0-9]{10}$|^isbn:[0-9]{13}$/)) {
          queryString += processedString + ',';
        }
        else {
          alert(processedString + ' is not in a valid format');
          return null;
        }
      });

      // Slice off the last comma and return
      return queryString.substring(0, queryString.length - 1);
    }


    var queryAPI = function(formattedQueryString) {
      $http({
        url: '/find',
        method: 'GET',
        params: {book: formattedQueryString}
      }).then(function(bookData) {
        console.log(bookData.data);
        if (bookData.data) {
          if (bookData.data.books) {
            $scope.books = bookData.data.books;
          }
          else {
            $scope.books = null;
          }

          if (bookData.data.notFound) {
            var alertString = bookData.data.notFound;
            alertString += bookData.data.notFound.length == 1 ? " wasn't found" : " weren't found"; 
            alert(alertString);
          }
        }
        else {
          alert("Please check the format of your query: " + bookName);
        }
      }, function(err) {
        console.log(err);
        alert("There was an error: " + err);
      });
    }
  }
});
