$(document).ready(function(){

    $(".M").toggle(
        function(){$( this).css({"background-color": "green"});},
        function(){$( this).css({"background-color": "black"});},
        function(){$( this).css({"background-color": "transparent"});}
      );

    $("#LevelStart").click(function(){
        $(".L1").css("background-color", "green");
    });

    $("#Level1").click(function(){
        $(".L2").css("background-color", "green"); 
        $(".L1").css("background-color", "black");
    });

    $("#Level2").click(function(){
        $(".L3").css("background-color", "green");
        $(".L2").css("background-color", "black");
    });

    $("#Level3").click(function(){
        $(".L4").css("background-color", "green");
        $(".L3").css("background-color", "black");
    });

    $("#Level4").click(function(){
        $(".L5").css("background-color", "green");
        $(".L4").css("background-color", "black");
    });

    $("#Level5").click(function(){
        $(".L5").css("background-color", "black");
    });

    $("#ReStart").click(function(){
        $(".LRS").css("background-color", "transparent");
    });

});