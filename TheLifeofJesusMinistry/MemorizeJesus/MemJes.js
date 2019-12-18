// Java Script for SUNBIBLE Memorization Guide Jesus Words
$(document).ready(function(){
    var words = $( ".red" ).text().split( /\s+/ );
    var text = words.join( "</a> <a>" );
    $( ".red" ).html( "<a>" + text + "</a>" );
    $( "a" ).on( "click", function() {
        $(this).css("background-color", "black");
    });
});