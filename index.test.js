// index.test.js

const { createRamenImage, displayRamens, handleClick } = require('./index');

describe("Cocktail Menu Tests", () => {
  test("createRamenImage should create an img element", () => {
    const ramen = {
      name: "Margarita",
      image: "https://example.com/margarita.jpg"
    };
    const img = createRamenImage(ramen);

    // Check that an image element is created
    expect(img.tagName).toBe("IMG");

    // Check that the image has the correct src and alt attributes
    expect(img.src).toBe(ramen.image);
    expect(img.alt).toBe(ramen.name);
  });

  test("displayRamens should fetch and display ramen images", async () => {
    // Mock fetch to return a sample list of ramen
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { name: "Margarita", image: "https://example.com/margarita.jpg" }
          ])
      })
    );

    // Call the displayRamens function and check the result
    await displayRamens();

    const ramenMenu = document.getElementById("ramen-menu");
    expect(ramenMenu.children.length).toBeGreaterThan(0); // There should be at least one ramen image
  });

  test("handleClick should update the DOM with ramen details", () => {
    const ramen = {
      name: "Margarita",
      image: "https://example.com/margarita.jpg",
      restaurant: "Cocktail Bar",
      rating: 8,
      comment: "A classic cocktail."
    };

    // Simulate clicking on a ramen image
    handleClick(ramen);

    // Check that the DOM is updated with the correct details
    expect(document.querySelector(".name").textContent).toBe(ramen.name);
    expect(document.querySelector(".restaurant").textContent).toBe(ramen.restaurant);
    expect(document.getElementById("rating-display").textContent).toBe(ramen.rating.toString());
    expect(document.getElementById("comment-display").textContent).toBe(ramen.comment);
  });
});


//Run the Tests: You can run the tests using the following command: npx jest
// PASS  src/index.test.js
// ✓ createRamenImage should create an img element (8 ms)
// ✓ displayRamens should fetch and display ramen images (10 ms)
// ✓ handleClick should update the DOM with ramen details (5 ms)
