// Java Script for SUNBIBLE Memorization Guide for James
$(document).ready(function(){


    // Java Script for SUNBIBLE Memorization Guide for James chapter 1 and 5
    $(".InputLevel1").click(function(){
        $(".R2, .RR2, .RRR2, .RRRR2, .RRRRR2").css("background-color", "white");
        $(".R1, .RR1, .RRR1, .RRRR1, .RRRRR1").css("background-color", "black");
    });
    $(".InputLevel2").click(function(){
        $(".R3, .RR3, .RRR3, .RRRR3, .RRRRR3").css("background-color", "white");
        $(".R2, .RR2, .RRR2, .RRRR2, .RRRRR2").css("background-color", "black");
    });
    $("#Level3, #LLevel3, #LLLevel3, #LLLLevel3, #LLLLLevel3").click(function(){
        $(".R4, .RR4, .RRR4, .RRRR4, .RRRRR4").css("background-color", "white");
        $(".R3, .RR3, .RRR3, .RRRR3, .RRRRR3").css("background-color", "black");
    });
    $("#Level4, #LLevel4, #LLLevel4, #LLLLevel4, #LLLLLevel4").click(function(){
        $(".R5, .RR5, .RRR5, .RRRR5, .RRRRR5").css("background-color", "white");
        $(".R4, .RR4, .RRR4, .RRRR4, .RRRRR4").css("background-color", "black");
    });
    $("#Level5, #LLevel5, #LLLevel5, #LLLLevel5, #LLLLLevel5").click(function(){
        $(".R5, .RR5, .RRR5, .RRRR5, .RRRRR5").css("background-color", "black");
    });
    $("#TryAgain1, #TryAgain2, #TryAgain3, #TryAgain4, #TryAgain5").click(function(){
        $(".R5, .RR5, .RRR5, .RRRR5, .RRRRR5").css("background-color", "transparent");
    });
    
    
    
    
    
    });