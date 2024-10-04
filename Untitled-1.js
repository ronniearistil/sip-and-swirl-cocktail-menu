// MVP Deliverables

// Global Variables
let cocktails = []; // Array to store cocktail data globally
let selectedCocktailId = null; // Store currently selected cocktail's ID

// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
  const img = document.createElement('img');
  img.src = cocktail.image; // Use image path from JSON data
  img.alt = cocktail.name; // Set alt attribute to cocktail name

  // Add a click event listener to show cocktail details when clicked
  img.addEventListener('click', () => handleClick(cocktail));

  // Append the cocktail image to a grid box and then to the #cocktail-menu div
  const cocktailBox = document.createElement('div');
  cocktailBox.classList.add('cocktail-box');
  cocktailBox.appendChild(img);

  document.getElementById('cocktail-menu').appendChild(cocktailBox);
};

// Function to fetch and display all cocktail images in the #cocktail-menu div
const displayCocktails = () => {
  fetch('http://localhost:3000/cocktails')
    .then(response => response.json())
    .then(data => {
      cocktails = data; // Save the fetched cocktails globally
      const cocktailMenu = document.getElementById('cocktail-menu');
      cocktailMenu.innerHTML = ''; // Clear the menu

      // Loop through each cocktail and create images for them
      cocktails.forEach(cocktail => createCocktailImage(cocktail));

      // Automatically display the first cocktail's details
      if (cocktails.length) {
        handleClick(cocktails[0]);
      }
    })
    .catch(error => console.error('Error fetching cocktails:', error));
};

// Function to display cocktail details when a cocktail image is clicked
const handleClick = (cocktail) => {
  selectedCocktailId = cocktail.id; // Store the currently selected cocktail's ID

  document.querySelector('#cocktail-detail img').src = cocktail.image;
  document.querySelector('.name').textContent = cocktail.name;

  // Combine ingredients and display them
  const ingredientsList = cocktail.ingredients
    .map(item => `${item.amount} ${item.name}`)
    .join(', ');
  document.getElementById('ingredients-display').textContent = ingredientsList;

  // Display the recipe
  document.getElementById('recipe-display').textContent = cocktail.recipe;

  // Set the cocktail ID for edit and delete actions
  document.getElementById('edit-cocktail').dataset.id = cocktail.id;
  document.getElementById('delete-button').dataset.id = cocktail.id;

  // Reset toggle states for ingredients and recipe buttons
  resetToggles();

  // Reset like and rating fields for the new cocktail
  document.getElementById('like-count').textContent = `${cocktail.likes || 0} Likes`;
  document.getElementById('rating').value = cocktail.rating || 1;
  document.getElementById('current-rating').textContent = `Rated: ${cocktail.rating || 1} Stars`;

  // Clear and display comments specific to this cocktail
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = ''; // Clear previous comments
  if (cocktail.comments) {
    cocktail.comments.forEach(comment => {
      const li = document.createElement('li');
      li.textContent = comment;
      commentList.appendChild(li);
    });
  }
};

// Function to reset toggle buttons for ingredients and recipe sections
const resetToggles = () => {
  const ingredientsDiv = document.querySelector('.ingredients-content');
  const recipeDiv = document.querySelector('.recipe-content');

  ingredientsDiv.style.display = 'none'; // Hide ingredients initially
  recipeDiv.style.display = 'none'; // Hide recipe initially

  document.querySelector('.ingredient-toggle').textContent = 'See Ingredients'; // Reset button text
  document.querySelector('.recipe-toggle').textContent = 'See Recipe'; // Reset button text
};

// Function to toggle between "See Ingredients" and "Hide Ingredients"
const setupIngredientToggle = () => {
  const button = document.querySelector('.ingredient-toggle');
  const ingredientsDiv = document.querySelector('.ingredients-content');

  button.addEventListener('click', () => {
    const isHidden = ingredientsDiv.style.display === 'none' || !ingredientsDiv.style.display;
    ingredientsDiv.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Hide Ingredients' : 'See Ingredients';
  });
};

// Function to toggle between "See Recipe" and "Hide Recipe"
const setupRecipeToggle = () => {
  const button = document.querySelector('.recipe-toggle');
  const recipeDiv = document.querySelector('.recipe-content');

  button.addEventListener('click', () => {
    const isHidden = recipeDiv.style.display === 'none' || !recipeDiv.style.display;
    recipeDiv.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Hide Recipe' : 'See Recipe';
  });
};

// Function to handle adding a new cocktail
const addSubmitListener = () => {
  const form = document.getElementById('new-cocktail');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Get ingredients input and split by new lines (using '\n') to handle multi-line input
    const rawIngredients = document.getElementById('new-ingredients').value.split('\n');
    const ingredients = rawIngredients.map(ingredientString => {
      const firstSpaceIndex = ingredientString.indexOf(' '); // Find the first space
      const amount = ingredientString.slice(0, firstSpaceIndex); // Get everything before the first space
      const name = ingredientString.slice(firstSpaceIndex + 1); // Get everything after the first space
      return { name, amount };
    });

    // Get the file input and create an object URL for the image
    const imageFile = document.getElementById('new-image').files[0];
    const imageUrl = URL.createObjectURL(imageFile);

    // Create a new cocktail object
    const newCocktail = {
      name: document.getElementById('new-name').value,
      ingredients: ingredients, // Use the structured ingredients array
      image: imageUrl, // Use the object URL as the image source
      recipe: document.getElementById('new-recipe').value,
      likes: 0, // Default value
      rating: 1, // Default value
      comments: [] // Default value
    };

    // Ensure all fields are filled out
    if (!newCocktail.name || !newCocktail.ingredients || !newCocktail.image || !newCocktail.recipe) {
      alert('Please fill out all fields.');
      return;
    }

    // Add the new cocktail to the server (POST request)
    fetch('http://localhost:3000/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail),
    })
    .then(response => response.json())
    .then(savedCocktail => {
      createCocktailImage(savedCocktail); // Add the new cocktail to the menu
      form.reset(); // Clear the form
    })
    .catch(error => console.error('Error adding cocktail:', error));
  });
};

// Function to handle editing a cocktail's recipe and ingredients (persisted)
const setupEditListener = () => {
  const form = document.getElementById('edit-cocktail');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const cocktailId = form.dataset.id; // Get the ID of the cocktail being edited

    // Get the new values from the form fields
    const newIngredients = document.getElementById('edit-ingredients').value.split(', ');
    const newRecipe = document.getElementById('edit-recipe').value;

    // Ensure fields are filled before proceeding
    if (!newIngredients || !newRecipe) {
      alert('Please fill out both the ingredients and the recipe.');
      return;
    }

    // Update the cocktail on the server (PATCH request)
    fetch(`http://localhost:3000/cocktails/${cocktailId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: newIngredients,
        recipe: newRecipe,
      }),
    })
    .then(() => {
      // Update the displayed cocktail details in the DOM
      document.querySelector('#ingredients-display').textContent = newIngredients.join(', ');
      document.getElementById('recipe-display').textContent = newRecipe;

      form.reset(); // Clear the form after submission
      alert('Cocktail details updated successfully!');
    })
    .catch(error => console.error('Error editing cocktail:', error));
  });
};

// Function to handle deleting a cocktail with confirmation
const setupDeleteListener = () => {
  const deleteButton = document.getElementById('delete-button');

  deleteButton.addEventListener('click', () => {
    const cocktailName = document.querySelector('.name').textContent;
    const cocktailId = document.getElementById('delete-button').dataset.id;

    // Show a confirmation dialog
    const userConfirmed = confirm(`Are you sure you want to delete the cocktail "${cocktailName}"?`);

    if (userConfirmed) {
      // Proceed with deletion if the user confirmed
      fetch(`http://localhost:3000/cocktails/${cocktailId}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Remove the cocktail from the DOM
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

          alert('Cocktail deleted successfully!');
        })
        .catch(error => console.error('Error deleting cocktail:', error));
    } else {
      alert('Deletion canceled.');
    }
  });
};

// Function to handle liking a cocktail, rating, and leaving a comment
const setupInteractionListeners = () => {
  const likeButton = document.getElementById('like-button');
  const likeCountSpan = document.getElementById('like-count');

  likeButton.addEventListener('click', () => {
    const cocktail = cocktails.find(c => c.id == selectedCocktailId); // Find the specific cocktail

    // Increment the like count and update the DOM
    cocktail.likes = (cocktail.likes || 0) + 1;
    likeCountSpan.textContent = `${cocktail.likes} Likes`;

    // Send a PATCH request to update the server
    fetch(`http://localhost:3000/cocktails/${selectedCocktailId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: cocktail.likes }),
    })
    .then(() => console.log('Like count updated successfully'))
    .catch(error => console.error('Error updating like count:', error));
  });

  const ratingSelect = document.getElementById('rating');
  const currentRatingSpan = document.getElementById('current-rating');

  ratingSelect.addEventListener('change', (event) => {
    const cocktail = cocktails.find(c => c.id == selectedCocktailId); // Find the specific cocktail

    // Update the rating for the specific cocktail and the DOM
    cocktail.rating = event.target.value;
    currentRatingSpan.textContent = `Rated: ${cocktail.rating} Stars`;

    // Send a PATCH request to update the server
    fetch(`http://localhost:3000/cocktails/${selectedCocktailId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: cocktail.rating }),
    })
    .then(() => console.log('Rating updated successfully'))
    .catch(error => console.error('Error updating rating:', error));
  });

  // Comment form
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');

  commentForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission from refreshing the page
    const commentBox = document.getElementById('comment-box').value;

    // Ensure the comment box is not empty before adding the comment
    if (commentBox.trim() === '') {
      alert('Please enter a comment.');
      return;
    }

    const cocktail = cocktails.find(c => c.id == selectedCocktailId);
    cocktail.comments.push(commentBox);

    // Send a PATCH request to update the server with new comments
    fetch(`http://localhost:3000/cocktails/${selectedCocktailId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: cocktail.comments }),
    })
    .then(() => {
      const li = document.createElement('li');
      li.textContent = commentBox;
      commentList.appendChild(li); // Add the comment to the list
      document.getElementById('comment-box').value = ''; // Clear the input box after submission
    })
    .catch(error => console.error('Error adding comment:', error));
  });
};

// Main function to initialize core deliverables
const main = () => {
  displayCocktails();
  addSubmitListener();
  setupIngredientToggle();
  setupRecipeToggle();
  setupEditListener();
  setupDeleteListener(); // Updated delete listener with confirmation
  setupInteractionListeners(); // New interaction listeners
};

// Ensure that the DOM is fully loaded before running the main function
document.addEventListener('DOMContentLoaded', main);
