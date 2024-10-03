// MVP Deliverables

let cocktails = []; // Declare a global variable for storing the cocktails array

// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
  const img = document.createElement('img');
  img.src = cocktail.image; // Use image path from JSON data
  img.alt = cocktail.name;

  // Add a click event listener to show cocktail details when clicked
  img.addEventListener('click', () => handleClick(cocktail));

  const cocktailBox = document.createElement('div');
  cocktailBox.classList.add('cocktail-box');
  cocktailBox.appendChild(img);

  document.getElementById('cocktail-menu').appendChild(cocktailBox);
};
// Fetch all cocktails and display them
const displayCocktails = () => {
  fetch('http://localhost:3000/cocktails')
    .then((response) => response.json())
    .then((data) => {
      cocktails = data;
      const cocktailMenu = document.getElementById('cocktail-menu');
      cocktailMenu.innerHTML = ''; // Clear the menu

      cocktails.forEach((cocktail) => createCocktailImage(cocktail));

      // Automatically display the first cocktail's details
      if (cocktails.length) {
        handleClick(cocktails[0]);
      }
    })
    .catch((error) => console.error('Error fetching cocktails:', error));
};

// Function to display cocktail details when clicked
const handleClick = (cocktail) => {
  document.querySelector('#cocktail-detail img').src = cocktail.image;
  document.querySelector('.name').textContent = cocktail.name;

  // Combine and display ingredients
  document.getElementById('ingredients-display').textContent = cocktail.ingredients
    .map((item) => `${item.amount} ${item.name}`)
    .join(', ');

  // Display recipe
  document.getElementById('recipe-display').textContent = cocktail.recipe;

  // Set the cocktail ID for edit and delete actions
  document.getElementById('edit-cocktail').dataset.id = cocktail.id;
  document.getElementById('delete-button').dataset.id = cocktail.id;

  // Display comments related to this cocktail
  displayCommentsForCocktail(cocktail);

  // Reset UI toggles
  resetToggles();
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
    event.preventDefault();

    // Create ingredients array
    const rawIngredients = document.getElementById('new-ingredients').value.split('\n');
    const ingredients = rawIngredients.map((ingredientString) => {
      const firstSpaceIndex = ingredientString.indexOf(' ');
      const amount = ingredientString.slice(0, firstSpaceIndex);
      const name = ingredientString.slice(firstSpaceIndex + 1);
      return { name, amount };
    });

    // Create new cocktail object
    const imageFile = document.getElementById('new-image').files[0];
    const imageUrl = URL.createObjectURL(imageFile);

    const newCocktail = {
      name: document.getElementById('new-name').value,
      ingredients: ingredients,
      image: imageUrl,
      recipe: document.getElementById('new-recipe').value,
      likes: 0,
      rating: 1,
      comments: []
    };

    if (!newCocktail.name || !newCocktail.ingredients || !newCocktail.image || !newCocktail.recipe) {
      alert('Please fill out all fields.');
      return;
    }

    // POST request to add a new cocktail
    fetch('http://localhost:3000/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail),
    })
      .then((response) => response.json())
      .then((savedCocktail) => {
        createCocktailImage(savedCocktail);
        form.reset(); // Clear the form
      })
      .catch((error) => console.error('Error adding cocktail:', error));
  });
};
// Function to handle editing a cocktail's recipe and ingredients (non-persisted)
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

    // Update the displayed cocktail details in the DOM
    document.querySelector('#ingredients-display').textContent = newIngredients.join(', ');
    document.getElementById('recipe-display').textContent = newRecipe;

    form.reset(); // Clear the form after submission
    alert('Cocktail details updated successfully!');
  });
};

// Function to handle deleting a cocktail (non-persisted) with confirmation
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
      // The user canceled the deletion
      alert('Deletion canceled.');
    }
  });
};

// Function to handle liking a cocktail, rating, and leaving a comment
const setupInteractionListeners = () => {
  const likeButton = document.getElementById('like-button');
  const likeCountSpan = document.getElementById('like-count');

  likeButton.addEventListener('click', () => {
    const cocktailId = document.getElementById('edit-cocktail').dataset.id;
    const cocktail = cocktails.find(c => c.id == cocktailId); // Find the specific cocktail

    // Increment the like count and update the DOM
    cocktail.likes = (cocktail.likes || 0) + 1;
    likeCountSpan.textContent = `${cocktail.likes} Likes`;
  });

  const ratingSelect = document.getElementById('rating');
  const currentRatingSpan = document.getElementById('current-rating');

  ratingSelect.addEventListener('change', (event) => {
    const cocktailId = document.getElementById('edit-cocktail').dataset.id;
    const cocktail = cocktails.find(c => c.id == cocktailId); // Find the specific cocktail

    // Update the rating for the specific cocktail and the DOM
    cocktail.rating = event.target.value;
    currentRatingSpan.textContent = `Rated: ${event.target.value} Stars`;
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

    const li = document.createElement('li');
    li.textContent = commentBox;
    commentList.appendChild(li); // Add the comment to the list
    document.getElementById('comment-box').value = ''; // Clear the input box after submission
  });

  // Add functionality for "See Comments" button
  const toggleButton = document.getElementById('toggle-comments');
  toggleButton.addEventListener('click', () => {
    if (commentList.style.display === 'none') {
      commentList.style.display = 'block';
      toggleButton.textContent = 'Hide Comments';
    } else {
      commentList.style.display = 'none';
      toggleButton.textContent = 'See Comments';
    }
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


