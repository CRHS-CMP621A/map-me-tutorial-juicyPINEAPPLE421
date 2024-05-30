"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map;
let mapEvent; // make global variables
let workouts = [];

////CLASSES/////
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
}

//child classes of Workout class
class Running extends Workout {
  type = "Running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); //from Workout class
    this.cadence = cadence; //step/min
    this.calcPace();
    this.setDescription();
  }

  //methods
  calcPace() {
    //min / km
    this.pace = this.duration / this.distance;
    this.pace = this.pace.toFixed(2);
    return this.pace;
  }

  setDescription() {
    this.discription = `${this.type} on ${this.date.toDateString()}`;
  }
}

class Cycling extends Workout {
  type = "Cycling";

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration); //from Workout class
    this.elevation = elevation; //meters
    this.calcSpeed();
    this.setDescription();
  }

  //methods
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    this.speed = this.speed.toFixed(2);
  }

  setDescription() {
    this.discription = `${this.type} on ${this.date.toDateString()}`;
  }
}

navigator.geolocation.getCurrentPosition(
  function (position) {
    //  console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coord = [latitude, longitude];
    console.log(coord);
    map = L.map("map").setView(coord, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    //Task 7.2 Load existing workouts from local storage
    const data = JSON.parse(localStorage.getItem("workouts"));

    //check if there is any data already stored
    if (data) {
      workouts = data; //load data into Workouts array
      console.log(data + "monkey");
    }

    //Render workout in sidebar for user
    let html;
    for (let workout of workouts) {
      let lat = workout.coords[0]; //lat and lng of each workout needed to display the marker
      let lng = workout.coords[1];

      if (workout.type === "Running") {
        html = `<li class="workout workout--running" data-id="${workout.id}">
        <h2 class="workout__title">${workout.discription}</h2>
        <div class="workout__details">
          <span class="workout__icon">🏃‍♂️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: true,
              className: "running-popup",
            })
          )
          .setPopupContent("Workout")
          .openPopup();
      } else if (workout.type === "Cycling") {
        html = `<li class="workout workout--cycling" data-id="${workout.id}">
        <h2 class="workout__title">${workout.discription}</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: true,
              className: "running-popup",
            })
          )
          .setPopupContent("Workout")
          .openPopup();
      }
      console.log(html);
      form.insertAdjacentHTML("afterend", html);
    }

    L.marker(coord).addTo(map).bindPopup("Your current location").openPopup();

    // console.log(map);
    map.on("click", function (mapE) {
      console.log(mapE);
      mapEvent = mapE;
      //     const lat = mapEvent.latlng.lat;
      //     const lng = mapEvent.latlng.lng;
      // //   L.marker([lat, lng]).addTo(map).bindPopup("Workout").openPopup();
      //     L.marker([lat, lng]).addTo(map)
      //     .bindPopup(L.popup({
      //         maxWidth:250,
      //         minWidth:100,
      //         autoClose:false,
      //         closeOnClick:true,
      //         className:'running-popup',
      //     }))
      //     .setPopupContent('Workout')
      //     .openPopup();

      form.classList.remove("hidden");
      inputDistance.focus();
    });

    // const run1 = new Running([39, -12], 5.2, 24, 178);
    // const cycling1 = new Cycling([39, -12], 27, 95, 523);
    // console.log(run1, cycling1);
  },
  function () {
    alert("Could not get position");
  }
);

form.addEventListener("submit", function (e) {
  e.preventDefault(); //prevent form reloading page..
  //console.log(e);
  /////// get data from form
  const type = inputType.value;
  const distance = Number(inputDistance.value); //convert to number
  const duration = Number(inputDuration.value);
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  let workout;
  //   L.marker([lat, lng]).addTo(map).bindPopup("Workout").openPopup();

  //If workout type running, create a running obj
  if (type == "running") {
    const cadence = Number(inputCadence.value);

    //validate form data later

    //create new running object
    workout = new Running([lat, lng], distance, duration, cadence);

    let html = `<li class="workout workout--running" data-id="${workout.id}">
      <h2 class="workout__title">${workout.discription}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`;

    form.insertAdjacentHTML("afterend", html);
  }

  //If workout type cycling, create a cycling obj
  if (type == "cycling") {
    const elevation = +inputElevation.value;

    //validate form data later

    //create new cycling object
    workout = new Cycling([lat, lng], distance, duration, elevation);

    let html = `<li class="workout workout--cycling" data-id="${workout.id}">
      <h2 class="workout__title">${workout.discription}</h2>
      <div class="workout__details">
        <span class="workout__icon">🚴‍♀️</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>`;

    form.insertAdjacentHTML("afterend", html);
  }

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: true,
        //openOnClick: true,
        className: "running-popup",
      })
    )
    .setPopupContent(workout.discription)
    .openPopup();

  workouts.push(workout);
  console.log(workouts);

  //Task 7.1 Local Storage of Workouts Array
  localStorage.setItem("workouts", JSON.stringify(workouts));

  form.classList.add("hidden");
  form.reset();
  inputType.value = type;
});

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});

containerWorkouts.addEventListener("click", function (e) {
  const workoutEl = e.target.closest(".workout"); //This selects the Workout class

  if (!workoutEl) return; //if workout not found then return out of this function

  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

  map.setView(workout.coords, 13, {
    //ser the Map View to the location of the workout coordinates
    animate: true,
    pan: {
      duration: 1,
    },
  });
});
