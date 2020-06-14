$(document).ready(function(){

    $(".W").click(function(){
        $( this ).css("background-color", "black");
    });

    $("#LevelStart").click(function(){
        $(".L1").css("background-color", "white");
    });

    $("#Level1").click(function(){
        $(".L2").css("background-color", "white"); 
        $(".L1").css("background-color", "black");
    });

    $("#Level2").click(function(){
        $(".L3").css("background-color", "white");
        $(".L2").css("background-color", "black");
    });

    $("#Level3").click(function(){
        $(".L4").css("background-color", "white");
        $(".L3").css("background-color", "black");
    });

    $("#Level4").click(function(){
        $(".L5").css("background-color", "white");
        $(".L4").css("background-color", "black");
    });

    $("#Level5").click(function(){
        $(".L5").css("background-color", "black");
    });

    $("#TryAgain1").click(function(){
        $(".L5").css("background-color", "transparent");
    });

});