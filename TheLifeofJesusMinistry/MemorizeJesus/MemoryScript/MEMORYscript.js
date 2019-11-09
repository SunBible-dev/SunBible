// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){
    var words = $( "#Chapter1" ).first().text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Chapter1" ).first().html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("__");
    });
});