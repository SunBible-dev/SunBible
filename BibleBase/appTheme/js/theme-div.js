$(document).ready(function() {
    var previousSrc = '';

    $('.BIBLEloader').click(function() {
        var iframe = $('#SBiframe');
        var currentSrc = iframe.attr('src');
        if ($('#themeSettings').is(':visible')) {
            $('#themeSettings').hide();
            $('#divFORiframe').show();
        } else if (currentSrc === '' || currentSrc === 'theme-nav.html') {
            previousSrc = currentSrc;
            iframe.attr('src', '../BibleBooksHTML/Book-id=1-Genesis.html');
            $('.HOMEdiv, #themeSettings, #divFORnav').hide();
            $('#divFORiframe').show();
        } else {
            $('.HOMEdiv, #themeSettings, #divFORnav').hide();
            $('#divFORiframe').show();
        }
    });

    $('.NAVloader').click(function() {
        $('.HOMEdiv, #divFORiframe, #themeSettings').hide();
        $('#divFORnav').show();
    });

    $('.THEMEloader').click(function() {
        $('.HOMEdiv, #divFORiframe, #divFORnav').hide();
        $('#themeSettings').show();
    });

    $('#divFORnav').on('click', 'a', function(e) {
        e.preventDefault();
        var link = $(this).attr('href');
        $('#SBiframe').attr('src', link);
        $('#divFORnav').hide();
        $('#divFORiframe').show();
    });

    $('.CLOSE').click(function() {
        $('#themeSettings').hide();
        $('#divFORiframe').show();
    });
});
