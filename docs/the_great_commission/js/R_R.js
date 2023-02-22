// Rome Road JS
$(document).ready(function(){

    $(".G_S_B").click(function(){
        $(".Get_Saved").css("display", "block");
        $(".Save_Some").css("display", "none");
    });

    $(".S_S_B").click(function(){
        $(".Get_Saved").css("display", "none");
        $(".Save_Some").css("display", "block");
    });
    
    });