// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){
    var words = $( "#Chapter15" ).text().split( /\s+/ );
    var text = words.join( "</a> <a>" );
    $( "#Chapter15" ).html( "<a>" + text + "</a>" );
    $( "a" ).on( "click", function() {
    $( this ).text("__");
    });
});