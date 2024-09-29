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

// Function to display cocktail details when clicked
const handleClick = (cocktail) => {
  document.querySelector('#cocktail-detail img').src = cocktail.image;
  document.querySelector('.name').textContent = cocktail.name;

  // Format the ingredients by combining amount and ingredient name
  const ingredientsList = cocktail.ingredients.map(item => `${item.amount} ${item.name}`).join(', ');
  document.getElementById('ingredients-display').textContent = ingredientsList;
  
  document.getElementById('recipe-display').textContent = cocktail.recipe;

  // Set the cocktail ID for edit and delete actions
  document.getElementById('edit-cocktail').dataset.id = cocktail.id;
  document.getElementById('delete-button').dataset.id = cocktail.id;

  // Reset toggle state to ensure correct button visibility
  resetToggles();

  // Add magnification effect on click
  const mainDisplay = document.querySelector('.main-display');
  mainDisplay.classList.add('magnify');

  // Optional: Reset the magnification after a few seconds
  setTimeout(() => {
    mainDisplay.classList.remove('magnify');
  }, 3000); // 3 seconds zoom-in effect
};

// Function to reset toggle buttons to their initial state
const resetToggles = () => {
  const ingredientsDiv = document.querySelector('.ingredients-content');
  const recipeDiv = document.querySelector('.recipe-content');
  
  // Hide both content areas initially
  ingredientsDiv.style.display = 'none';
  recipeDiv.style.display = 'none';

  // Reset buttons to "See" state
  document.querySelector('.ingredient-toggle').textContent = 'See Ingredients';
  document.querySelector('.recipe-toggle').textContent = 'See Recipe';
};

// Function to toggle between "See Ingredients" and "Hide Ingredients"
const setupIngredientToggle = () => {
  const button = document.querySelector('.ingredient-toggle');
  const ingredientsDiv = document.querySelector('.ingredients-content');
  
  button.addEventListener('click', () => {
    if (ingredientsDiv.style.display === 'none' || !ingredientsDiv.style.display) {
      ingredientsDiv.style.display = 'block';
      button.textContent = 'Hide Ingredients';
    } else {
      ingredientsDiv.style.display = 'none';
      button.textContent = 'See Ingredients';
    }
  });
};

// Function to toggle between "See Recipe" and "Hide Recipe"
const setupRecipeToggle = () => {
  const button = document.querySelector('.recipe-toggle');
  const recipeDiv = document.querySelector('.recipe-content');
  
  button.addEventListener('click', () => {
    if (recipeDiv.style.display === 'none' || !recipeDiv.style.display) {
      recipeDiv.style.display = 'block';
      button.textContent = 'Hide Recipe';
    } else {
      recipeDiv.style.display = 'none';
      button.textContent = 'See Recipe';
    }
  });
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
        cocktailMenu.removeChild(img.parentElement); // Remove the parent div containing the image
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

// Main function to initialize core deliverables
const main = () => {
  displayCocktails();
  addSubmitListener();
  setupIngredientToggle();
  setupRecipeToggle();
  setupEditListener();
  setupDeleteListener();
};

// Ensure that the DOM is fully loaded before running the main function
document.addEventListener('DOMContentLoaded', main);

  
  