const openWidth = $('.nav-left').outerWidth(true);
const menuTop = $('.menu').outerHeight(true);

console.log(menuTop);
$('.menu').animate({top: menuTop},0)


$('.sidenav').animate({left: -openWidth},0);
console.log(openWidth);


var isOpen = false;
var test = 0;

$('.open').on('click' , function(){
    console.log('hi');
    $(this).addClass('d-none');
    $('.close').removeClass('d-none');
    $('.sidenav').animate({left:0},500);
    $('.menu').animate({top: 0},500)
    
})


$('.close').on('click',function(){
    console.log('close btn');
    $(this).addClass('d-none');
    $('.open').removeClass('d-none');
    $('.sidenav').animate({left: -openWidth},500);
    $('.menu').animate({top: menuTop},500)
})

$('.menu-item').on('click',function(){
  console.log('close btn');
  $('.close').addClass('d-none');
  $('.open').removeClass('d-none');
  $('.sidenav').animate({left: -openWidth},500);
  $('.menu').animate({top: menuTop},500)
})




let foodName = document.getElementsByClassName('food-name')
let foodImg = document.getElementsByClassName('food-img')
let rowContent = document.getElementById('row-content')
let searchInput = document.getElementById('search-input')
// let searchInput = document.getElementById('search-input')
// let searchLetter = document.getElementById('search-letter')

//fetch data 
async function getFoodData(){
  let foodResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
  let foodData = await foodResponse.json();
  // console.log(foodData)
  // return foodData
  displayMeals(foodData.meals)
}

//search
async function getMealDataByName(mealName){
  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
  let foodName = await Response.json();
  console.log(foodName.meals)
  foodName.meals ? displayMeals(foodName.meals) : displayMeals([])
}

async function getMealDataByFirstLetter(mealInitial){
  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealInitial}`);
  let foodName = await Response.json();
  console.log(foodName.meals)
  foodName.meals ? displayMeals(foodName.meals) : displayMeals([])
}
function searchInterface(){
  rowContent.innerHTML = ""
  let search = `
  <div class="row py-4 ">
                    <div class="col-md-6 ">
                        <input onkeyup="getMealDataByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="getMealDataByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
                    </div>
                </div>`
  searchInput.innerHTML = search
}



function displayMeals(arr){
  let meal = ""
  for(let i = 0;i<arr.length;i++){
    meal += `
    <div class="col-md-3 mb-4">
                    <div onclick="getMealDetails('${arr[i].idMeal}')" class="food-item position-relative overflow-hidden">
                        <img class="food-img rounded-3" src=${arr[i].strMealThumb} alt="">
                        <div class="img-overlay d-flex position-absolute top-100 h-100 w-100  rounded-3">
                            <h3 class="food-name align-self-center">${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>`
  }

  rowContent.innerHTML = meal
}

//meal details
async function getMealDetails(mealId){
  let mealDetailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
  let mealDetailsData = await mealDetailsResponse.json();
  //return mealDetailsData
  displayMealDetails(mealDetailsData.meals[0])
  // console.log(mealDetailsData)
}

function displayMealDetails(data){

let ingredients = ``
for(let i = 1;i<=20;i++){
  if (data[`strIngredient${i}`]) {
    ingredients += `<li class="alert alert-info m-2 p-1">${data[`strMeasure${i}`]} ${data[`strIngredient${i}`]}</li>`
  }
}

let tags = data.strTags?.split(",") //law fi tags a3ml split
if (!tags) 
  {
    tags = []
  }

  let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }


console.log(tags)
  let mealDetails = `
    <div class="col-md-4">
                    <img class="food-img rounded-3 w-100" src=${data.strMealThumb} alt="">
                    <h3 class="text-white">${data.strMeal}</h3>
                </div>

                <div class="col-md-8 text-white">
                    <h2>Instructions</h2>
                    <p>${data.strInstructions}</p>
                    <h3>Area: ${data.strArea}</h3>
                    <h3>Category: ${data.strCategory}</h3>
                    <h3>Recipes</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                    <!-- ingredients -->
                      ${ingredients}
                    </ul>
                    <h3>Tags</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        <!-- tags -->
                        ${tagsStr}
                    </ul>
                    <a href="${data.strSource}" class="btn btn-success">Source</a>
                    <a href="${data.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>
  `
  console.log(ingredients)
  rowContent.innerHTML = mealDetails
}

//categories
async function getCategories(){
  searchInput.innerHTML = ""
  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  let Data = await Response.json();
  //return mealDetailsData
  displayCategories(Data.categories)
  console.log(Data.categories)
}

function displayCategories(arr){
  
  let category = ""
  for(let i = 0;i<arr.length;i++){
    category+=`<div class="col-md-3 mb-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="food-item position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="img-overlay position-absolute text-center text-black p-2  rounded-3 top-100 h-100 w-100 ">
                        <h3>${arr[i].strCategory}</h3>
                        <p class="h-100">${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
    `

  }

  rowContent.innerHTML = category
}


async function getCategoryMeals(category) {
  rowContent.innerHTML = ""
  
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  data = await response.json()


  displayMeals(data.meals.slice(0, 20))
}

//Areas

async function getArea() {
  rowContent.innerHTML = ""
  searchInput.innerHTML = "";

  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  Data = await Response.json()
  displayArea(Data.meals)
}

function displayArea(arr) {
  let area = "";

  for (let i = 0; i < arr.length; i++) {
    area += `
      <div class="col-md-3 text-white">
              <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-house-laptop fa-4x"></i>
                      <h3>${arr[i].strArea}</h3>
              </div>
      </div>
      `
  }

  rowContent.innerHTML = area
}

async function getAreaMeals(area) {
  rowContent.innerHTML = ""

  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  Data = await Response.json()
  displayMeals(Data.meals.slice(0, 20))

}


//ingredients
async function getIngredients() {
  rowContent.innerHTML = ""
  searchInput.innerHTML = "";

  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  Data = await Response.json()
  console.log(Data.meals);
  displayIngredients(Data.meals.slice(0, 20))

}

function displayIngredients(arr) {
  let ingredient = "";

  for (let i = 0; i < arr.length; i++) {
    ingredient += `
      <div class="col-md-3 text-white">
              <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
      </div>
      `
  }

  rowContent.innerHTML = ingredient
}


async function getIngredientsMeals(ingredients) {
  rowContent.innerHTML = ""

  let Response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
  Data = await Response.json()
  displayMeals(Data.meals.slice(0, 20))

}


//contacts



async function start(searchName = "",id = ""){
  let foodData = await getFoodData(searchName)
  // let mealDetailsData = await getMealDetails(id)
  // let categories = await getCategories(id)
  // displayMeals(foodData.meals)
  // searchInterface()
  // getFoodData()
  

} 
start()


function showContacts() {
  searchInput.innerHTML = ""
  rowContent.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}



