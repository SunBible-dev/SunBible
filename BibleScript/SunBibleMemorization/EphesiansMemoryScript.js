// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){
    var words = $( ".M" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( ".M" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___");
    });
});
