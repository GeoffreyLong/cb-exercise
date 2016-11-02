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
      var bookString = $scope.bookQuery.string;
      var processedQueryString = processBookNames(bookString);

      // Reset the table
      $scope.books = null;

      // Only run the API query with a valid string
      if (processedQueryString != null) {
        queryAPI(processedQueryString);
      }
    }

    // Function takes the string book name and checks for correctness
    // This is based on the common formats for ISBN and LCCN numbers
    // ISBN is a string of 10 or 13 numbers
    // LCCN is slightly more complicated
    //    LCCN will include a year followed by a serial number (meaning all digits)
    //    Two digits for years from 1898 to 2000, four beginning in 2001
    //      1898 to 1900 are distinguished by the size of the serial number
    //      1969 and 1972 has some numbers beginning with 7
    //    The serial number is six digits and includes leading zeros now
    //      Older years may not be six digits
    //    Sometimes there is a hyphen between the date and the serial
    //    According to https://www.loc.gov/marc/lccn_structure.html
    //      You can also have an alphabetic prefix, supplemental number, a suffix, and a revision date
    //      The site says 6 for the serial, but I have seen them with 4
    //      Given the possibility of these variances, I will air on the side of caution
    //      It is probably better to allow a fake LCCN than not allow a real one
    //    All that being said, the API shows the format as 9 numbers 
    //      though their strings are typically 8 or 10, so that might be a typo
    var processBookNames = function(bookNames) {
      // Don't worry about the case the user enters "ISBN" or "LCCN" in 
      // "IsbN" is still acceptable
      var lowerBookNames = bookNames.toLowerCase();
      var queryString = "";

      lowerBookNames.split(',').forEach(function(token) {
        // Remove the white space
        var processedString = token.trim();
        
        // If the token is in a valid format then add it to the query string
        // Else alert the user and return null  
        if (processedString.match(/^isbn:[0-9]{10}$|^isbn:[0-9]{13}$|^lccn:[0-9]{2,4}-?[0-9]{4,6}$/)) {
          queryString += processedString + ',';
        }
        else {
          alert(processedString + ' is not in a valid format');
          return null;
        }
      });

      // Slice off the last comma and return
      // Check for empty string before slicing
      if (queryString) {
        return queryString.substring(0, queryString.length - 1);
      }
      else {
        return null;
      }
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
