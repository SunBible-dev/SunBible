// Nav js used on pr
$(document).ready(function(){

    $(".NavLink").click(function(){
        $("nav").toggle();
        $(".NavLink").toggleClass("change");
    });

    $('nav a').click(function(){
        $("nav").toggle();
        $(".NavLink").toggleClass("change");
    });
    
    });