// Java Script for SUNBIBLE Memorization Guide Jesus Words
$(document).ready(function () {

    

    $(".red").toggle(
        function(){$( this).css({"background-color": "black"});},
        function(){$( this).css({"background-color": "red"});},
        function(){$( this).css({"background-color": "white"});}
    );

    $("#Undo").click(function () { $(".red").css("background-color", "transparent"); });

});