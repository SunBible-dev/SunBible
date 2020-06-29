// Java Script for SUNBIBLE Memorization Guide for James - Just the words

$(document).ready(function(){


    $(".M, .MM, .MMM, .MMMM, .MMMMM").toggle(
      function(){$( this).css({"background-color": "white"});},
      function(){$( this).css({"background-color": "black"});}
    );



  });