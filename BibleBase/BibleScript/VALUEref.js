// See more in links to Sub=nBible

$(document).ready(function () {
  
// Create a URL object from the current URL
var currentURL = new URL(window.location.href);

// Create a URLSearchParams object from the query string of the current URL
var params = new URLSearchParams(currentURL.search);

// Define a list of allowed URLs
var allowedURLs = ["https://sunbible-dev.github.io/"];

// Get the iframe element by id
var iframe = document.getElementById("myframe");

// Check if the ref parameter exists
if (params.has("ref")) {
  // Get the value of ref
  var refValue = params.get("ref");

  // Check if the ref value is one of the allowed URLs
  if (allowedURLs.includes(refValue)) {
    // Set the src attribute to the ref value
    iframe.src = refValue;
  }
}

});