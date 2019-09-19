$(document).on("click", ".nextSlide", function() {
    fullpage_api.moveSlideRight();
  });
$(document).on("click", ".prevSlide", function() {
    fullpage_api.moveSlideLeft();
  });
  $(document).on("click", ".nextSection", function() {
    fullpage_api.moveSectionDown();
  });
  $(document).on("click", ".goToProjects", function() {    
    fullpage_api.moveSectionDown();
  });
  $(document).on("click", ".goToContact", function() {    
    fullpage_api.moveSectionDown();
  });