
// Load the content of the page
function loader() {
    // remove the flex class from the loading screen
    if($('#loading-screen').hasClass('flex')) {
        $('#loading-screen').removeClass('flex');
        $('#loading-screen').addClass('hidden');
    }
    // add the flex class to the loading screen
    else {
        $('#loading-screen').addClass('flex');
        $('#loading-screen').removeClass('hidden');
    }
}



function load_content(url) {
    $.ajax({
        url: url,
        success: function(data) {
            $('#mainConteiner').html(data);
        }
    });
}