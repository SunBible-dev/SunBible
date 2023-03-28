// I may have origionaly created this file for some other reason
// In 2023 I am using this to be able to create links to sunbible that open specific pages

$(document).ready(function () {
  
// Get the referrer URL
var referrer = document.referrer;

// Create a URL object from the referrer string
var referrerURL = new URL(referrer);

// Get the hostname of the referrer URL
var referrerHostname = referrerURL.hostname;

// Define the desired domain name
var desiredDomain = "https://sunbible-dev.github.io";

// Get the iframe element by id
var iframe = document.getElementById("SBiframe");

// Check if the referrer hostname matches the desired domain name
if (referrerHostname === desiredDomain) {
  // Set the src attribute to the referrer URL
  iframe.src = referrer;
}

});