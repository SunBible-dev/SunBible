$(document).ready(function(){

    $(".Nav_C").click(function(){
        $(".Nav_C").css("display", "none");
        $("#LifeNav").css("display", "block");
    });

    $(".Nav_C_Hide").click(function(){
        $(".Nav_C").css("display", "block");
        $("#LifeNav").css("display", "none");
    });
    
    });