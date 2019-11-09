// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){
    var words = $( "#Chapter5" ).first().text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Chapter5" ).first().html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("__");
    });
    var words = $( "#Chapter6" ).first().text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Chapter7" ).first().html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("__");
    });
    var words = $( "#Chapter7" ).first().text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Chapter7" ).first().html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("__");
    });
});