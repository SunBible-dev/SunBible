document.querySelectorAll('.menu').forEach(function(element) {
    element.addEventListener('click', function() {
 
    document.querySelector('header').style.display = 'block';
    document.getElementById('divFORiframe').style.display = 'block';
    document.getElementById('READNOW').style.display = 'none';
});
});