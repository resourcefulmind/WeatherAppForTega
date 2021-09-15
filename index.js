//when the person enters a search parameter or a city and clicks the submit button, grab the form
const form = document.querySelector(".initial-display form");
const input = document.querySelector(".initial-display input");
const apiKey = "7cf52f8bb8cc8bf4b547897d4245415e";
const msg = document.querySelector(".initial-display .msg");
const list = document.querySelector(".ajax-section .cities")


//then add an event listener to listen for submit and prevent reloading of the page by default 
form.addEventListener("submit", e => {
    e.preventDefault();
    const inputVal = input.value;

    //To check if a city already exists
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    if(listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = ""; //for example, Athens.

            if (inputVal.includes(",")) {
                //check at this point if the country code has more than two letters and keep only the first part of inputVal
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                    .querySelector(".city-name span")
                    .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                } 
            } else {
                //Lagos
                content = el.querySelector(".city-name span").textContent.toLowerCase();        
            }
            return content == inputVal.toLowerCase();
        });

        //If i have searched the name of the city before, This should let me know that it has been done already
        if (filteredArray.length > 0) {
            msg.textContent = `You already know what the weather in ${filteredArray[0].querySelector(".city-name span").textContent} looks like, you can however be more precise by providing the country code as well 😉`;
            form.reset();
            input.focus();
            return;
        }
    }

    //time to make that AJAX request
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //collect the data that I need and then create an associated list item
            const { main, name, sys, weather, clouds } = data;

            //construct my icon URL and display it in the card via the img tag
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

            //create the associated list item
            const li = document.createElement("li");

            //add the class named city to it
            li.classList.add("city");

            //now I am going to append the list items created with the data i collected via the API call
            const markup = 
            `<h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span> 
                <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
                </div>
                    <figure>
                        <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
                            <figcaption>${weather[0]["description"]}</figcaption>
                    </figure>
            `;
            //attach the li to the dom
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Your city no dey map, maybe na hamlet you dey stay...search for a valid city, no stress me 😩";
        })

        msg.textContent = "";
        form.reset();
        input.focus();
})
























































