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
  document.querySelector('.ingredients').textContent = `Ingredients: ${cocktail.ingredients.join(', ')}`;
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
    document.querySelector('.ingredients').textContent = 'Ingredients: Insert Ingredients Here';
    document.getElementById('recipe-display').textContent = 'Insert recipe here';
  });
};

// Initialize advanced deliverables
document.addEventListener('DOMContentLoaded', () => {
  setupEditListener();
  setupDeleteListener();
});


// Extra Advanced Deliverables

// Function to handle editing a cocktail's recipe and ingredients (persisted)
const setupPersistedEditListener = () => {
  const form = document.getElementById('edit-cocktail');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cocktailId = form.dataset.id;

    const updatedCocktail = {
      ingredients: document.getElementById('edit-ingredients').value.split(', '),
      recipe: document.getElementById('edit-recipe').value,
    };

    fetch(`http://localhost:3000/cocktails/${cocktailId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCocktail)
    })
      .then(response => response.json())
      .then(() => {
        document.getElementById('recipe-display').textContent = updatedCocktail.recipe;
        document.querySelector('.ingredients').textContent = `Ingredients: ${updatedCocktail.ingredients.join(', ')}`;
        form.reset();
      })
      .catch(error => console.error('Error updating cocktail:', error));
  });
};

// Function to handle deleting a cocktail (persisted)
const setupPersistedDeleteListener = () => {
  const deleteButton = document.getElementById('delete-button');

  deleteButton.addEventListener('click', () => {
    const cocktailId = deleteButton.dataset.id;

    fetch(`http://localhost:3000/cocktails/${cocktailId}`, {
      method: 'DELETE'
    })
      .then(() => {
        const cocktailMenu = document.getElementById('cocktail-menu');
        const cocktailImages = cocktailMenu.getElementsByTagName('img');
        for (let img of cocktailImages) {
          if (img.alt === document.querySelector('.name').textContent) {
            cocktailMenu.removeChild(img);
            break;
          }
        }

        // Clear the cocktail details section
        document.querySelector('#cocktail-detail img').src = './images/default-placeholder.jpg';
        document.querySelector('.name').textContent = 'Insert Name Here';
        document.querySelector('.ingredients').textContent = 'Ingredients: Insert Ingredients Here';
        document.getElementById('recipe-display').textContent = 'Insert recipe here';
      })
      .catch(error => console.error('Error deleting cocktail:', error));
  });
};

// Initialize extra advanced deliverables
document.addEventListener('DOMContentLoaded', () => {
  setupPersistedEditListener();
  setupPersistedDeleteListener();
});

// Export functions for testing
export {
  displayCocktails,
  addSubmitListener,
  handleClick,
  main,
};

  