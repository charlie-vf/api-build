const API_KEY = "r7X6c4-1J7ASUhNYpoz8tH4zGXs"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

// we're passing in 'e' there which is a reference to the event.
// We won’t actually use it  in these lessons, but it’s 
// good practice to pass the event  object into our handler function.
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    // create temporary empty array
    let optArray = [];

    // then iterate through the entries and push them into the array
    for (let e of form.entries()) {
        // if equal to options then we're going to push the second
        // value in each entry into the temporary array
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }
    // will delete all occurences of options in our form data
    form.delete("options");
    // append new options and use .join to convert into a string (the API requires a string)
    // this will append back a comma separated string of options
    form.append("options", optArray.join());

    return form;
}


async function postForm(e) {

    // FormData:
    // can capture all of the fields in a HTML form and return it as an object.
    // we can then give this object to "fetch", and we don't need to do any other processing.
    const form = processOptions(new FormData(document.getElementById("checksform")));
    
    // if you want to confirm  that the form has captured correctly,
    // then the formData object has several default methods that allow us to manipulate the data. 
    // One of these, is the entries method. Which we can iterate through to see the form entries. 
    // for (let e of form.entries()) {
    //   console.log(e);
    // }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
    // ^^ this will make a POST request to the API, authorize it with the API key,  
    // and attach the form as the body of the request.

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint results for ${data.file}`;

    // the key names below are taken from the console in dev tools
    // total_errors
    // error_list
    // error.col
    // etc....
    if (data.total_errors === 0) {
        results = `<div class="no-errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            // report  the line & column numbers where these errors are happening.
            // line and column are within the same div, here, just separate lines
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            // pass in the error text that comes back from json
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}


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
        displayException(data);
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

// displayException(data) added before the throw new data in the postForm and getStatus
// if statements
function displayException(data) {

    let heading = `An Exception Occurred`;

    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}