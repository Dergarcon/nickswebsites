// get all elements with .modal
setInterval(() => {
    $modals = document.querySelectorAll('.modal')
    $modals.forEach( $modal => {        
        if ($modal.className.includes('show')) {            
             fullpage_api.fitToSection()            
        }
    })        
}, 5);



// check if one element hast .show and if so change scrolling behaviour