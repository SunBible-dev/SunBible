// Java Script for SUNBIBLE Memorization Guide
$(document).ready(function(){

$(".M, .MM, .MMM, .MMMM, .MMMMM").click(function(){
    $( this ).css("background-color", "black");
});

$("#Level1, #LLevel1").click(function(){
    $(".R2, .RR2").css("background-color", "white");
    $(".R1, .RR1").css("background-color", "black");
});
$("#Level2, #LLevel2").click(function(){
    $(".R3, .RR3").css("background-color", "white");
    $(".R2, .RR2").css("background-color", "black");
});
$("#Level3, #LLevel3").click(function(){
    $(".R4, .RR4").css("background-color", "white");
    $(".R3, .RR3").css("background-color", "black");
});
$("#Level4, #LLevel4").click(function(){
    $(".R5, .RR5").css("background-color", "white");
    $(".R4, .RR4").css("background-color", "black");
});
$("#Level5, #LLevel5").click(function(){
    $(".R5, .RR5").css("background-color", "black");
});
$("#TryAgain1, #TryAgain2").click(function(){
    $(".R5, .RR5").css("background-color", "transparent");
});

$(".MMM").click(function(){$( this ).css("background-color", "black");});
$("#LLLevel1").click(function(){$(".RRR1").css("background-color", "black");});
$("#LLLevel2").click(function(){$(".RRR2").css("background-color", "black");});
$("#LLLevel3").click(function(){$(".RRR3").css("background-color", "black");});
$("#LLLevel4").click(function(){$(".RRR4").css("background-color", "black");});
$("#LLLevel5").click(function(){$(".RRR5").css("background-color", "black");});
$("#TryAgain3").click(function(){$(".RRR5").css("background-color", "transparent");});
$(".MMMM").click(function(){$( this ).css("background-color", "black");});
$("#LLLLevel1").click(function(){$(".RRRR1").css("background-color", "black");});
$("#LLLLevel2").click(function(){$(".RRRR2").css("background-color", "black");});
$("#LLLLevel3").click(function(){$(".RRRR3").css("background-color", "black");});
$("#LLLLevel4").click(function(){$(".RRRR4").css("background-color", "black");});
$("#LLLLevel5").click(function(){$(".RRRR5").css("background-color", "black");});
$("#TryAgain4").click(function(){$(".RRRR5").css("background-color", "transparent");});
$(".MMMMM").click(function(){$( this ).css("background-color", "black");});
$("#LLLLLevel1").click(function(){$(".RRRRR1").css("background-color", "black");});
$("#LLLLLevel2").click(function(){$(".RRRRR2").css("background-color", "black");});
$("#LLLLLevel3").click(function(){$(".RRRRR3").css("background-color", "black");});
$("#LLLLLevel4").click(function(){$(".RRRRR4").css("background-color", "black");});
$("#LLLLLevel5").click(function(){$(".RRRRR5").css("background-color", "black");});
$("#TryAgain5").click(function(){$(".RRRRR5").css("background-color", "transparent");});
});