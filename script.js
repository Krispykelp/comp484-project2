$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.Consume-button').click(clickedConsumeButton);
    $('.Aurafarm-button').click(clickedAurafarmButton);
    $('.Excercise-button').click(clickedExcerciseButton);
    $('.Flex-button').click(clickedFlexButton);
  

  
    
  })
  
    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    var pet_info = {name:"Chad", weight:"??", happiness:"??"};
  
    function clickedConsumeButton() {
      // Increase pet happiness, pet weight, energy
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedAurafarmButton() {
      // Increase happiness, Aura score
      // Decrease energy
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedExcerciseButton() {
      // Increase strength, Muscle Mass, happiness 
      // Decrease energy
      checkAndUpdatePetInfoInHtml();
    }

     function clickedFlexButton() {
      // Increase Happiness
      // Decrease Energy  
      checkAndUpdatePetInfoInHtml();
    }
  
    function checkAndUpdatePetInfoInHtml() {
      checkStatsBeforeUpdating();  
      updatePetInfoInHtml();
    }
    
    function checkStatsBeforeUpdating() {
      // Add conditional so if weight is lower than zero.
    }
    
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      $('.weight').text(pet_info['weight']);
      $('.happiness').text(pet_info['happiness']);
    }
  