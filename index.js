// MVP Deliverables
// Core Deliverables

// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
    const img = document.createElement('img');
    img.src = cocktail.image; // Use full URL from the JSON data
    img.alt = cocktail.name; // Set alt attribute to the cocktail name
  
    // Add a click event listener to show cocktail details when clicked
    img.addEventListener('click', () => handleClick(cocktail));
  
    // Append the cocktail image to the #cocktail-menu div
    document.getElementById('cocktail-menu').appendChild(img);
  };
  
  // Function to fetch and display all cocktail images in the #cocktail-menu div
  const displayCocktails = () => {
    fetch('http://localhost:3000/cocktails')
      .then(response => response.json())
      .then(cocktails => {
        const cocktailMenu = document.getElementById('cocktail-menu');
        cocktailMenu.innerHTML = ''; // Clear the menu
  
        // Loop through each cocktail and create images for them
        cocktails.forEach(cocktail => createCocktailImage(cocktail));
  
        // Automatically display the first cocktail's details
        if (cocktails.length > 0) {
          handleClick(cocktails[0]);
        }
      })
      .catch(error => console.error('Error fetching cocktails:', error));
  };
  
  // This function will display cocktail details when a cocktail image is clicked
  const handleClick = (cocktail) => {
    document.querySelector('#cocktail-detail img').src = cocktail.image;
    document.querySelector('.name').textContent = cocktail.name;
    document.querySelector('.ingredients').textContent = `Ingredients: ${cocktail.ingredients}`;
    document.getElementById('recipe-display').textContent = cocktail.recipe;
  
    // Set the cocktail ID for edit and delete actions
    document.getElementById('edit-cocktail').dataset.id = cocktail.id;
    document.getElementById('delete-button').dataset.id = cocktail.id;
  };
  
  // Function to handle the submission of a new cocktail
  const addSubmitListener = () => {
    const form = document.getElementById('new-cocktail');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form reload
  
      // Create a new cocktail object from form inputs
      const newCocktail = {
        name: document.getElementById('new-name').value,
        ingredients: document.getElementById('new-ingredients').value.split(', '),
        image: document.getElementById('new-image').value,
        recipe: document.getElementById('new-recipe').value,
      };
  
      // Ensure all fields are filled out
      if (!newCocktail.name || !newCocktail.ingredients || !newCocktail.image || !newCocktail.recipe) {
        alert("Please fill out all fields.");
        return;
      }
  
      // Add the new cocktail image to the menu
      createCocktailImage(newCocktail);
      form.reset(); // Clear the form
    });
  };
  
  // Main function to initialize core deliverables
  const main = () => {
    displayCocktails();
    addSubmitListener();
  };
  
  // Ensure that the DOM is fully loaded before running the main function
  document.addEventListener('DOMContentLoaded', main);
  