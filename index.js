// MVP Deliverables
// Helper function to create a cocktail image element and add it to the #cocktail-menu
const createCocktailImage = (cocktail) => {
  const img = document.createElement('img');
  img.src = cocktail.image; // Use full URL from the JSON data
  img.alt = cocktail.name; // Set alt attribute to the cocktail name
  
  // Add a click event listener to show cocktail details when clicked
  img.addEventListener('click', () => handleClick(cocktail));

  const cocktailBox = document.createElement('div');
  cocktailBox.classList.add('cocktail-box');
  cocktailBox.appendChild(img);
  
  // Append the cocktail image to the #cocktail-menu div
  
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

//my code
//Display details and click
const handleClick = (cocktail) => {
  const detailImage = document.querySelector("#cocktail-detail img");
  detailImage.src = cocktail.image;

  const cocktailName = document.querySelector(".cocktail-name");
  cocktail.Name.textContent = cocktail.name;
};















displayCocktails();

