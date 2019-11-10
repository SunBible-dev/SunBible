// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){
    var words = $( "#Ephesians1" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
    var words = $( "#Ephesians2" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Ephesians2" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
    var words = $( "#Ephesians3" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Ephesians3" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
    var words = $( "#Ephesians4" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Ephesians4" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
    var words = $( "#Ephesians5" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Ephesians5" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
    var words = $( "#Ephesians6" ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( "#Ephesians6" ).html( "<span>" + text + "</span>" );
    $( "span" ).on( "click", function() {
    $( this ).text("___"); 
    });
});
