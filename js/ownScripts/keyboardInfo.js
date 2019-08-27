var value = getCookie("nickmarek-cookies");
    if (value == "accepted") {        
        $('#modalKeyboard').css('display', 'none')                
        $('#modalKeyboard').removeClass('show')        
    } else {        
        $('#modalKeyboard').css('display', 'block')       
        $('#modalKeyboard').addClass('show')                  
    }

$closeBtns = document.querySelectorAll('#modalKeyboard button')
$closeBtns.forEach($btn => {
    $btn.addEventListener('click' , (event) => {        
        $('#modalKeyboard').css('display', 'none')                
        $('#modalKeyboard').removeClass('show')  
    })
})

// Detect all clicks on the document
document.addEventListener('click', function (event) {

	// If the click happened inside the modal, do nothing
	if (event.target.closest('.modal')) return;

    $('#modalKeyboard').css('display', 'none')                
        $('#modalKeyboard').removeClass('show')  

}, false);
