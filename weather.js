
const interaction = document.querySelector('.interaction');
const cityInput = document.querySelector('.cityInput');
const weatherdata = document.querySelector('.weatherdata');
const apiKey = "5220c3266c5c05980f03afcef166c384";



// added an event listener to the interaction box which is submit for when the user submits their location.
interaction.addEventListener("submit", async event => {

    //Forms have a default behaviour of refreshing the page once submitted. This prevents the page from refreshing.
    event.preventDefault(); 

    //creating a constant called city to store the value of the cityInput as the user add the details, then creating an if statement to show certain data if the city input is recognised. If not it will display an error message.
    const city = cityInput.value;

    if (city) {
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData)
        
        }
        catch (error){
            console.log(error)
            displayError(error)
        }

    } else {
        displayError("Please enter a city");
    }

})


//async function to return a promise (weather data of that city) after the user has pressed the search button.
//async makes a function return a promise. E.g.
async function getWeatherData(city){

    //created a const for the api url. passed in the city and apikey variables for live data for city.
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    //fetch the apiurl - *await can only be used in a async function*
    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not fetch weather data")
    }

    return await response.json();

}

//function to display weather data from the API
function displayWeatherInfo(data){

    //OBJECT DESTRUCTING: Using {} or [] to pull only the most necessary info from a larger array.
    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data; // assigning the array values to data variable.
    
    
    weatherdata.textContent = "";         //displaying the weatherdata box with no text
    weatherdata.style.display = "grid";   //display property to grid


    //calling to display the elements created in HTML inside the weatherdata box.
    //calling them back as a new element and giving them a new variable
    const locationDisplay = document.createElement("h2");
    const temperatureDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const conditionsDisplay = document.createElement("p");
    const weatherEmojiDisplay = document.createElement("p");

    locationDisplay.classList.add("location");
    temperatureDisplay.classList.add("temperature");
    humidityDisplay.classList.add("humidity");
    conditionsDisplay.classList.add("conditions");
    weatherEmojiDisplay.classList.add("weatherEmoji");



    // pulling from our data variable above, which we got from the API array.
    locationDisplay.textContent = city;
    temperatureDisplay.textContent = `${(temp - 274.15).toFixed(1)}°c`; //1. TEMPLATE LITERAL `${}`// 2. minus 274.15 to convert k to c° & enclose the equation // 3. .toFixed(1) converts a floating point number to an integer.
    humidityDisplay.textContent = `Humidity: ${humidity}`;
    conditionsDisplay.textContent = description ? description.replace(/\b\w/g, c => c.toUpperCase()): ""; // Turns the first letter for each word to uppercase.
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);


    // appendChild adds the new variable as a child to weatherdata.
    weatherdata.appendChild(locationDisplay);
    weatherdata.appendChild(temperatureDisplay);
    weatherdata.appendChild(humidityDisplay);
    weatherdata.appendChild(conditionsDisplay);
    weatherdata.appendChild(weatherEmojiDisplay);

}

//function to get an emoji based on the weather
function getWeatherEmoji(weatherId){

    //SWITCH statements replace if and else if statements when there are multiple conditions. Makes the code much cleaner.
    switch(true){ 
        case (weatherId >= 200 && weatherId < 300):
        return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
        return "🌧️";
        case (weatherId >= 400 && weatherId < 500):
        return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
        return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
        return "😶‍🌫️";
        case (weatherId === 800):
        return "☀️";
        case (weatherId >= 801 && weatherId < 810):
        return "☁️";
        default: return "🛸"
        

    }

}


//function to catch any errors if any.
function displayError(message){

    //created a new 'p' element in js using createElement and stored it's value in a constant called "errorDisplay". 
    const errorDisplay = document.createElement("p");

    //changing the text content to be the text stored in the message variable.
    errorDisplay.textContent = message;

    //accessing the class list for errorDisplay to mirror it's css properties on the new text.
    errorDisplay.classList.add("errorDisplay");


    //this is resetting the text content in the weather details is there is something there currently. Reset to an empty string. 
    weatherdata.textContent = "";

    //this is changing the style of the weather details to grid so all data when it appears, shows up in columns.
    weatherdata.style.display = "block";

    //Taking our new errorDisplay element and appending/ adding it as a child element to to the already existing weather details element.
    weatherdata.appendChild(errorDisplay);

}


