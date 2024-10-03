
        $(document).ready(function() {
            var previousSrc = '';

            $('.BIBLEloader').click(function() {
                var iframe = $('#SBiframe');
                if ($('#themeSettings').is(':visible')) {
                    $('#themeSettings').hide();
                    $('#divFORiframe').show();
                } else if (iframe.attr('src') === '' || iframe.attr('src') === 'theme-nav.html') {
                    previousSrc = iframe.attr('src');
                    iframe.attr('src', '../BibleBooksHTML/Book-id=1-Genesis.html');
                    $('.HOMEdiv, #themeSettings').hide();
                    $('#divFORiframe').show();
                } else {
                    iframe.attr('src', previousSrc);
                    $('.HOMEdiv, #themeSettings').hide();
                    $('#divFORiframe').show();
                }
            });

            $('.NAVloader').click(function() {
                var iframe = $('#SBiframe');
                previousSrc = iframe.attr('src');
                iframe.attr('src', 'theme-nav.html');
                $('.HOMEdiv, #themeSettings').hide();
                $('#divFORiframe').show();
            });

            $('.THEMEloader').click(function() {
                $('.HOMEdiv, #divFORiframe').hide();
                $('#themeSettings').show();
            });

            $('.CLOSE').click(function() {
                $('#themeSettings').hide();
                $('#divFORiframe').show();
            });
        });
