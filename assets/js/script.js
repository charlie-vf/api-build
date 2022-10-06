const API_KEY = "r7X6c4-1J7ASUhNYpoz8tH4zGXs"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

// we're passing in 'e' there which is a reference to the event.
// We won’t actually use it  in these lessons, but it’s 
// good practice to pass the event  object into our handler function.
document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    // The query string will consist of the URL and 
    // the parameters that we need  to send over to the API.
    // this just pulls on the predeclared constants to make it all look cleaner
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    // now we 'await' a response
    const response = await fetch(queryString);
    // when the response comes back, we need to convert it to json
    const data = await response.json();
    // at this stage in our function, we can assume that we'll have some data back.
    // It will either be our key expiry data, or it will be an error.

    // If everything has gone well, a property is set on the response object.
    // And this property is the “ok” property.
    // If the server returns the HTTP status code of 200 then, then you’ll remember, our request
    // has been successful and the “ok” property will be set to True.
    // If it returns an error code, then the “ok” property will be set to false.
    // check to see if response.ok property is set to true
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }   // we're using the built-in JavaScript error handler to throw a new error but you can 
        //see here where it says  
        // 'data.error' that that's the descriptive message from the json that's been returned.
}
// needs to set the heading text to API key status, it needs to set the body 
// text to "your key is valid until" and the date, and it needs to show the modal. 
function displayStatus(data) {
    let heading = "API Key Status";
    let results = "<div>Your key is valid until</div>";
    results += `<div class="key-status">${data.expiry}</div>`;
    
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}