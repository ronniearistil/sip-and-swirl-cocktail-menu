// MVP Deliverables
// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
  const img = document.createElement('img');
  img.src = cocktail.image; // Use full URL from the JSON data
  img.alt = cocktail.name; // Set alt attribute to the cocktail name
  
  // Add a click event listener to show cocktail details when clicked
  img.addEventListener('click', () => handleClick(cocktail));
  
  // Append the cocktail image to the #cocktail-menu div
  const cocktailBox = document.createElement('div');
  cocktailBox.classList.add('cocktail-box');
  cocktailBox.appendChild(img);
  
  document.getElementById('cocktail-menu').appendChild(cocktailBox);
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

// Function to display cocktail details when clicked
const handleClick = (cocktail) => {
  document.querySelector('#cocktail-detail img').src = cocktail.image;
  document.querySelector('.name').textContent = cocktail.name;
  
  // Set ingredients and recipe into their respective collapsible sections
  document.getElementById('ingredients-display').textContent = cocktail.ingredients.join(', ');
  document.getElementById('recipe-display').textContent = cocktail.recipe;
  
  // Set the cocktail ID for edit and delete actions
  document.getElementById('edit-cocktail').dataset.id = cocktail.id;
  document.getElementById('delete-button').dataset.id = cocktail.id;
};

// Function to toggle collapsible content
const setupCollapsibles = () => {
  const collapsibles = document.querySelectorAll('.collapsible h3');
  
  collapsibles.forEach(collapsible => {
    collapsible.addEventListener('click', () => {
      const content = collapsible.nextElementSibling;
  
      // Toggle the active class for the collapsible section
      collapsible.parentElement.classList.toggle('active');
  
      // Adjust max-height for the dropdown
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
};

// Main function to initialize core deliverables
const main = () => {
  displayCocktails();
  addSubmitListener();
  setupCollapsibles();
};

// Ensure that the DOM is fully loaded before running the main function
document.addEventListener('DOMContentLoaded', main);

// Advanced Deliverables

// Function to handle editing a cocktail's recipe and ingredients (non-persisted)
const setupEditListener = () => {
  const form = document.getElementById('edit-cocktail');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cocktailId = form.dataset.id;
  
    // Update the displayed cocktail details in the DOM with new recipe and ingredients
    const newRecipe = document.getElementById('edit-recipe').value;
    const newIngredients = document.getElementById('edit-ingredients').value.split(', ');
  
    document.getElementById('recipe-display').textContent = newRecipe;
    document.querySelector('.ingredients').textContent = `Ingredients: ${newIngredients.join(', ')}`;
  
    form.reset(); // Clear the edit form after submission
  });
};

// Function to handle deleting a cocktail (non-persisted)
const setupDeleteListener = () => {
  const deleteButton = document.getElementById('delete-button');
  
  deleteButton.addEventListener('click', () => {
    const cocktailName = document.querySelector('.name').textContent;
  
    // Remove the cocktail image from the menu
    const cocktailMenu = document.getElementById('cocktail-menu');
    const cocktailImages = cocktailMenu.getElementsByTagName('img');
    for (let img of cocktailImages) {
      if (img.alt === cocktailName) {
        cocktailMenu.removeChild(img);
        break;
      }
    }
    // Clear the cocktail details section
    document.querySelector('#cocktail-detail img').src = './images/default-placeholder.jpg';
    document.querySelector('.name').textContent = 'Insert Name Here';
    document.getElementById('ingredients-display').textContent = 'Insert Ingredients Here';
    document.getElementById('recipe-display').textContent = 'Insert recipe here';
  });
};

// Initialize advanced deliverables
document.addEventListener('DOMContentLoaded', () => {
  setupEditListener();
  setupDeleteListener();
});
