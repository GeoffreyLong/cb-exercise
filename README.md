# cb-exercise
Initial coding exercise for Carbon Black

## TODO 
- Improve error handling
- Add validation to the input form (angular style validation)
- Check for duplicate books where both the ISBN and LCCN are inputted?
- Add better frontend error handling for the server return

## TESTS
Would want separate sets of valid, incorrectly formatted, and non-existent ISBNs and LCCNs for the following. Tests can be created dynamically by mixing the sets.
- Valid entries: Single ISBN, multiple ISBN, single LCCN, multiple LCCN, multiple ISBN and LCCN 
  - All of the above with incorrectly formatted strings
  - All of the above with a mix of correct and incorrect formatting
  - All of the above with non-existent ISBNs and LCCNs
  - All of the above with a mix of correct, incorrect, and non-existent
  - Duplicates
- ISBNs or LCCNs with long outputs (to test the table)
- Large ISBN and LCCN entries (many identifiers passed to server)
- Duplicates where ISBN and LCCN correspond to the same book

## Possible optimizations
- As soon as the user enters a comma we can run that specific book identifier. This would speed up the user experience. We could either pipe the data directly to the table when the user enters a value, or we could store the results of previous queries and only display when the user clicks the search button. The tradeoff is that there will be many more (smaller) queries to the server and the API, so it might not save any time at all. 
- Another way to use the input would be to assess the format as soon as the user enters a comma. This way, the user doesn't have to wait until pressing the search key to find out they have entered something wrong.
- Depending on the use cases, we could cache some searches. I could see the same person looking up the same book multiple times within a reasonable number of queries. I could also see people looking up the same books during a given time period, especially when it comes to new releases. We would need a caching function, but least recently used would be a good place to start. The user's previous searches could be stored in localstorage. This will allow for around 5mb of local data. The general searches could be stored in a database. Since the book information we are saving doesn't change often, we could keep the cached items for a while. We would still want some sort of expiry token to be checked when we fetch the data. On expiry, the API would be queried. In both cases we would have to see when the search, storage, and setting up the search structure becomes more expensive than the API queries given our hardware. The API may also have rules about how much of their data you can store.
- A user interface improvement would be to model the input after mail client recipient fields. For instance, in Outlook, when you press enter or add a comma, the field is encapsulated in a removable or editable element. These elements could be colored red if the format is incorrect. 
- If either the ISBN or LCCN is indexed has some specific indexing (i.e. increases monotonically from 0), you could probably leverage that to know whether or not the entry is a valid identifier. If you know there are no ISBNs of the form 9XXXXXXXXXX then that would be very useful.
- Using some server side templating like react to serve up the tables would probably speed up the appication.

## Ongoing issues
- Since I only have the formatting of the ISBMs and LCCNs, I may pass some inputs to the backend that are formatically correct, but non-existent. I handled these on the server by creating a field in my return object for codes that did not have a corresponding entry on the API. All I was able to do was inform the user of the error though. I could possibly keep a reference sheet of all the ISBNs and LCCNs to search for a possible match. This would take up space and possibly time though. I would have to compare the querying time vs the matching time. It might be worth it if a lot of erroneous inputs are entered into the system. I could possibly implement the structure as a B+ tree of sorts. 
- LCCN formatting is an issue. There are a lot of different formats that could be allowed (ISBN:0385472579,LCCN:62019420). I was going to allow all of them, since I think it is better to allow an incorrect query than to deny the user a real one. I believe the API accepts only numeric LCCNs though. If I were to launch a production app that used their API, I would try to email a developer to double check the allowed formats, since it was unclear in their documentation.
- It is possible to exceed the size of a GET request if we queried with a couple hundred identifiers. I'm not sure how many the library's API or Node will allow. It might be worth it to break large queries into chunks. I don't know who would want to enter several hundred identifiers, and I believe Node or the browser handles the errors in this case, but it is still worth considering.
- A user can call the API directly via a call like localhost/find?book=ISBN:0385472579. This just gives them the output of the JSON in their browser window. I might be able to limit this by placing the book information in the http header, and redirecting the user to the root if they don't have the header. I considered the possibility of using server side scripting for this, so the page is sent with the data. This might ruin the SPA aspect of the program though, since you are reloading the page each time. 
- More informative status codes could be probably be used. 

## Multiple Views Implementation
  Before you asked be how I would implement the case of having several different implementations on the same page to avoid git checkouts for different tags. The index.html would have a header component, an ng-view component, and a table component. The header and table components would exist throughout the application, while the ng-view would be switched out. 
  Clicking one of the links in the header would call the angular route specific to the implementation to change the ng-view. This would switch out the input and search button components, since these will have different behaviours and displays in the optimized version. The the server interface and the client side input vetting could be encapsulated into services. They are good candidates since they are largely shared amongst the different implementations. The data would be shared between the input and table components through the API calling service. 
  The backend code could be largely shared. At least in both versions of the implementation I made, a string was passed the same way to the backend. How the data is handled on the server is also rather similar, the major only difference being the array output in the multi call. If you used an array in both cases, you could avoid having to manipulate the results before they are used by the table component. 
  I could have implemented the database caching via a header field or the query string. This would call a function to whittle down the string based on what is stored in the server, and another function to handle storing the API call result. The client side caching could have been done similarly in the API client. 
  In the end, there would be no practical reason in doing this. It would have made the exercise more interesting, but it would have slowed development down. One benefit the services would have added is greater testability.
