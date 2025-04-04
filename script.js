const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container'); // Fixed selector
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        // Check if meals exist
        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
            return;
        }

        recipeContainer.innerHTML = ""; // Clear previous results

       
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                 <h3>${meal.strMeal}</h3>
                 <p><span>${meal.strArea}</span> Dish</p>
                 <p> Belongs to <span>${meal.strCategory}</span> Category</p>

            `
            const button = document.createElement('button');
            button.textContent = "View Recipe"
            recipeDiv.appendChild(button)
            
// Adding EventListner to recipe button 
button.addEventListener('click' , ()=>{
    openRecipePopup(meal);

});

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
};

// Function for fetching ingredients and measurement 
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];  // Fixed the property name
        if (ingredient && ingredient.trim() !== "") {
            const measure = meal[`strMeasure${i}`] || "";
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } 
        else {
            break;
        }
    }
    return ingredientsList;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = 
    `<h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
    <div class="recipeinstructions">
    <h3>Instruction:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    `;
   
    recipeDetailsContent.parentElement.style.display = "block";
};

// Event listener for Close  button
recipeCloseBtn.addEventListener('click', ()=>{
    recipeDetailsContent.parentElement.style.display = "none"; 
})

// Event listener for search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search Box</h2>`
        return;
    }
    fetchRecipes(searchInput);
});
