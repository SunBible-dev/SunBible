// Java Script for SUNBIBLE Memorization Guide Jesus Words
$(document).ready(function () {
    $(".red").on("click", function Memorization() { $(this).css("background-color", "red"); });
    $("#Undo").click(function () { $(".red").css("background-color", "transparent"); });
});