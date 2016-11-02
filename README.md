# cb-exercise
Initial coding exercise for Carbon Black

Rerouting to main url 
- Implementation: This was done by catching all unmatched routes and redirecting to root index
- Initial concerns: I'm not sure if this will interfere with the find route. Initial testing shows that it won't. 
    - I am concerned that if find is invoked as the initial URL that it won't render the HTML. I will probably have to error check this.

TODO 
- Improve error handling
- Add validation to the input form (angular style validation)
- Check for duplicate books
- Add better frontend error handling for the server return
