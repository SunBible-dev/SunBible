// Java Script for SUNBIBLE Memorization Guide for James - Just the words

$(document).ready(function(){


    $(".Black").toggle(
      function(){$( this).css({"background-color": "yellow"});},
      function(){$( this).css({"background-color": "black"});},
      function(){$( this).css({"background-color": "transparent"});}
    );

    $(".Red").toggle(
        function(){$( this).css({"background-color": "yellow"});},
        function(){$( this).css({"background-color": "red"});},
        function(){$( this).css({"background-color": "transparent"});}
      );



  });