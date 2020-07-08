$(document).ready(function(){

    $(".M").toggle(
        function(){$( this).css({"background-color": "blue"});},
        function(){$( this).css({"background-color": "black"});}
      );

    $("#LevelStart").click(function(){
        $(".L1").css("background-color", "blue");
    });

    $("#Level1").click(function(){
        $(".L2").css("background-color", "blue"); 
        $(".L1").css("background-color", "black");
    });

    $("#Level2").click(function(){
        $(".L3").css("background-color", "blue");
        $(".L2").css("background-color", "black");
    });

    $("#Level3").click(function(){
        $(".L4").css("background-color", "blue");
        $(".L3").css("background-color", "black");
    });

    $("#Level4").click(function(){
        $(".L5").css("background-color", "blue");
        $(".L4").css("background-color", "black");
    });

    $("#Level5").click(function(){
        $(".L5").css("background-color", "black");
    });

    $("#ReStart").click(function(){
        $(".LRS").css("background-color", "transparent");
    });

});