angular.module('find').component('find', {
  templateUrl: 'find/find.template.html',
  controller: function FindController($scope, $http) {

    // Instantiate the book query object
    // This is for the 2 way data binding with the input field, 
    // though I don't really use that functionality
    $scope.bookQuery = {};

    // Instantiate the books object
    // This will hold the books when they are populated
    $scope.books = null;

    // Function runs when the input button is clicked
    // It will ensure the input is valid, then it will call the GET to the server
    $scope.findBooks = function() {
      // Reset the table
      $scope.books = null;

      // Only run the API query with a valid string
      var processedQueryString = processBookNames($scope.bookQuery.string);
      if (processedQueryString) {
        console.log(processedQueryString);
        queryAPI(processedQueryString);
      }
    }

    // Function takes the string book name and checks for correctness
    //    based on the common formats for ISBN and LCCN numbers
    //    It will return a comma delimited string of the numbers if all are valid
    //    and an empty string otherwise
    // ISBN is a string of 10 or 13 numbers
    // LCCN is slightly more complicated
    //    There are a decent number of LCCN variations (some involving symbols or letters)
    //    However, the API shows the format as only numbers, typically between 8 and 10 digits
    //    This would require further investigation since the description was vague
    var processBookNames = function(bookNames) {
      // Don't worry about the case the user enters "ISBN" or "LCCN" in 
      // "IsbN" is still acceptable
      var lowerBookNames = bookNames.toLowerCase();
      var queryArray = [];

      var tokens = lowerBookNames.split(','); 
      for (var i = 0; i < tokens.length; i ++) {
        var token = tokens[i];

        // Remove the white space
        var processedString = token.trim();
        
        // If the token is in a valid format and is not a duplicate, then add to the string
        // Else alert the user and return null  
        if (processedString.match(/^isbn:[0-9]{10}$|^isbn:[0-9]{13}$|^lccn:[0-9]{2,4}-?[0-9]{4,6}$/)) {
          if (!queryArray.includes(processedString)) queryArray.push(processedString);
        }
        else {
          alert(processedString + ' is not in a valid format');
          return "";
        }
      }

      return queryArray.toString();
    }


    // Make a GET request to the backend
    // Include the formatted query string as a parameter to the request
    var queryAPI = function(formattedQueryString) {
      $http({
        url: '/find',
        method: 'GET',
        params: {books: formattedQueryString}
      }).then(function(data) {
        var returnStructure = data.data;

        // If there is no data, send an alert
        // If there is data then process it
        if (Object.keys(returnStructure).length === 0 && returnStructure.constructor === Object) {
          alert("No data was returned...");
        }
        else {
          // Should be null unless there was an error in the call to openlibrary
          if (returnStructure.err) {
            alert("There was an error in the API call: " + bookData.err);
          }
          else {
            // See if there are any books
            // If there are none, set the books to null to get rid of the table
            if (returnStructure.books.length) {
              $scope.books = returnStructure.books;
            }

            // Alert the user of any books that weren't found in the API
            if (returnStructure.notFound.length) {
              var alertString = returnStructure.notFound;
              alertString += returnStructure.notFound.length == 1 ? " wasn't found" : " weren't found"; 
              alert(alertString);
            }
          }
        }
      }, function(err) {
        console.log(err);
        alert("There was an error: " + err);
      });
    }
  }
});
