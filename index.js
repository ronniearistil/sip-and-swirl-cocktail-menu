// MVP Deliverables

// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
  const img = document.createElement('img');  // Create an <img> element
  img.src = cocktail.image;  // Set the image source from the cocktail object
  img.alt = cocktail.name;  // Set the alt text for accessibility to the cocktail's name
  
  // Add a click event listener to show cocktail details when clicked
  img.addEventListener('click', () => handleClick(cocktail));

  // Create a container div for the image and append the image inside
  const cocktailBox = document.createElement('div');
  cocktailBox.classList.add('cocktail-box');  // Add a class for styling purposes
  cocktailBox.appendChild(img);  // Add the image inside the container div

  // Add the cocktailBox (with the image) to the #cocktail-menu div in the DOM
  document.getElementById('cocktail-menu').appendChild(cocktailBox);
};

// Function to fetch and display all cocktail images in the #cocktail-menu div
const displayCocktails = () => {
  // Fetch cocktail data from a local JSON server
  fetch('http://localhost:3000/cocktails')
    .then(response => response.json())  // Convert the response into JSON format
    .then(cocktails => {
      const cocktailMenu = document.getElementById('cocktail-menu');
      cocktailMenu.innerHTML = '';  // Clear out any existing content in the menu
    
      // Loop through the list of cocktails and display each as an image
      cocktails.forEach(cocktail => createCocktailImage(cocktail));
    
      // Automatically display details of the first cocktail
      if (cocktails.length) {
        handleClick(cocktails[0]);
      }
    })
    .catch(error => console.error('Error fetching cocktails:', error));  // Handle any fetch errors
};

// Function to display cocktail details when a cocktail image is clicked
const handleClick = (cocktail) => {
  // Update the image and text in the main display with details of the clicked cocktail
  document.querySelector('#cocktail-detail img').src = cocktail.image;
  document.querySelector('.name').textContent = cocktail.name;

  // Display the ingredients by combining the amount and name
  const ingredientsList = cocktail.ingredients.map(item => `${item.amount} ${item.name}`).join(', ');
  document.getElementById('ingredients-display').textContent = ingredientsList;

  // Display the recipe
  document.getElementById('recipe-display').textContent = cocktail.recipe;

  // Set the cocktail ID for edit and delete functionality
  document.getElementById('edit-cocktail').dataset.id = cocktail.id;
  document.getElementById('delete-button').dataset.id = cocktail.id;

  // Reset the toggle buttons for ingredients and recipe
  resetToggles();
};

// Function to reset toggle buttons for ingredients and recipe sections
const resetToggles = () => {
  // Get the ingredients and recipe sections and initially hide them
  const ingredientsDiv = document.querySelector('.ingredients-content');
  const recipeDiv = document.querySelector('.recipe-content');

  ingredientsDiv.style.display = 'none';  // Hide ingredients by default
  recipeDiv.style.display = 'none';  // Hide recipe by default

  // Reset the toggle button text to show "See" options
  document.querySelector('.ingredient-toggle').textContent = 'See Ingredients';
  document.querySelector('.recipe-toggle').textContent = 'See Recipe';
};

// Function to toggle between "See Ingredients" and "Hide Ingredients"
const setupIngredientToggle = () => {
  const button = document.querySelector('.ingredient-toggle');  // Get the ingredient toggle button
  const ingredientsDiv = document.querySelector('.ingredients-content');  // Get the ingredients section

  button.addEventListener('click', () => {
    // Toggle the visibility of the ingredients section
    if (ingredientsDiv.style.display === 'none' || !ingredientsDiv.style.display) {
      ingredientsDiv.style.display = 'block';  // Show ingredients
      button.textContent = 'Hide Ingredients';  // Change button text
    } else {
      ingredientsDiv.style.display = 'none';  // Hide ingredients
      button.textContent = 'See Ingredients';  // Change button text
    }
  });
};

// Function to toggle between "See Recipe" and "Hide Recipe"
const setupRecipeToggle = () => {
  const button = document.querySelector('.recipe-toggle');  // Get the recipe toggle button
  const recipeDiv = document.querySelector('.recipe-content');  // Get the recipe section

  button.addEventListener('click', () => {
    // Toggle the visibility of the recipe section
    if (recipeDiv.style.display === 'none' || !recipeDiv.style.display) {
      recipeDiv.style.display = 'block';  // Show recipe
      button.textContent = 'Hide Recipe';  // Change button text
    } else {
      recipeDiv.style.display = 'none';  // Hide recipe
      button.textContent = 'See Recipe';  // Change button text
    }
  });
};

// Function to handle adding a new cocktail
const addSubmitListener = () => {
  const form = document.getElementById('new-cocktail');  // Get the form for adding a new cocktail

  form.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent form submission from refreshing the page

    // Get ingredients input and split by new lines to handle multi-line input
    const rawIngredients = document.getElementById('new-ingredients').value.split('\n');
    const ingredients = rawIngredients.map(ingredientString => {
      const firstSpaceIndex = ingredientString.indexOf(' ');  // Find the first space
      const amount = ingredientString.slice(0, firstSpaceIndex);  // Extract the amount
      const name = ingredientString.slice(firstSpaceIndex + 1);  // Extract the ingredient name
      return { name, amount };  // Return an object with name and amount
    });

    // Get the file input and create an object URL for the image
    const imageFile = document.getElementById('new-image').files[0];
    const imageUrl = URL.createObjectURL(imageFile);  // Generate a URL for the image

    // Create a new cocktail object with the form inputs
    const newCocktail = {
      name: document.getElementById('new-name').value,
      ingredients: ingredients,  // Use the structured ingredients array
      image: imageUrl,  // Use the object URL as the image source
      recipe: document.getElementById('new-recipe').value,
    };

    // Ensure all fields are filled out
    if (!newCocktail.name || !newCocktail.ingredients || !newCocktail.image || !newCocktail.recipe) {
      alert("Please fill out all fields.");
      return;
    }

    // Add the new cocktail image to the menu and reset the form
    createCocktailImage(newCocktail);
    form.reset();  // Clear the form inputs
  });
};

// Function to handle editing a cocktail's recipe and ingredients (non-persisted)
const setupEditListener = () => {
  const form = document.getElementById('edit-cocktail');  // Get the edit cocktail form

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cocktailId = form.dataset.id;  // Get the cocktail ID from the dataset

    // Update the displayed cocktail details
    const newRecipe = document.getElementById('edit-recipe').value;
    const newIngredients = document.getElementById('edit-ingredients').value.split(', ');

    document.getElementById('recipe-display').textContent = newRecipe;  // Update recipe display
    document.querySelector('.ingredients').textContent = `Ingredients: ${newIngredients.join(', ')}`;  // Update ingredients display

    form.reset();  // Clear the form after submission
  });
};

// *** STRETCH GOAL: Function to handle deleting a cocktail (non-persisted) ***
const setupDeleteListener = () => {
  const deleteButton = document.getElementById('delete-button');  // Get the delete button

  deleteButton.addEventListener('click', () => {
    const cocktailName = document.querySelector('.name').textContent;  // Get the current cocktail name

    // Remove the corresponding cocktail image from the menu
    const cocktailMenu = document.getElementById('cocktail-menu');
    const cocktailImages = cocktailMenu.getElementsByTagName('img');
    for (let img of cocktailImages) {
      if (img.alt === cocktailName) {
        cocktailMenu.removeChild(img.parentElement);  // Remove the parent div containing the image
        break;
      }
    }

    // Clear the main display after deletion
    document.querySelector('#cocktail-detail img').src = './images/default-placeholder.jpg';
    document.querySelector('.name').textContent = 'Insert Name Here';
    document.getElementById('ingredients-display').textContent = 'Insert Ingredients Here';
    document.getElementById('recipe-display').textContent = 'Insert recipe here';

    alert("Cocktail deleted successfully!");
  });
};



// Main function to initialize all features when the page is loaded
const main = () => {
  displayCocktails();  // Display all cocktails on the page
  addSubmitListener();  // Add a listener for creating new cocktails
  setupIngredientToggle();  // Add toggle functionality for ingredients
  setupRecipeToggle();  // Add toggle functionality for recipes
  setupEditListener();  // Enable cocktail editing
  setupDeleteListener();  // Enable cocktail deletion
};

// Ensure that the DOM is fully loaded before running the main function
document.addEventListener('DOMContentLoaded', main);  // Run 'main' when the DOM is ready

  