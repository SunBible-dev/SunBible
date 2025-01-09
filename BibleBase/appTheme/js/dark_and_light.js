$(document).ready(function() {
    // Load Genesis by default
    $('#SBiframe').attr('src', '../BibleBooksHTML/Book-id=1-Genesis.html');
    $('#divFORiframe').show();

    $('.BIBLEloader').click(function() {
        $('#divFORnav').hide();
        $('#divFORiframe').show();
    });

    $('.NAVloader').click(function() {
        $('#divFORiframe').hide();
        $('#divFORnav').show();
    });

    $('#divFORnav').on('click', 'a', function(e) {
        e.preventDefault();
        var link = $(this).attr('href');
        $('#SBiframe').attr('src', link);
        $('#divFORnav').hide();
        $('#divFORiframe').show();
    });

    
});

