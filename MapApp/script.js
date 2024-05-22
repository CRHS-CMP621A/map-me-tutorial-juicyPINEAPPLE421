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
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); //from Workout class
    this.cadence = cadence; //step/min
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration); //from Workout class
    this.elevation = elevation; //meters
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
  }

  //If workout type cycling, create a cycling obj
  if (type == "cycling") {
    const elevation = +inputElevation.value;

    //validate form data later

    //create new cycling object
    workout = new Cycling([lat, lng], distance, duration, elevation);
  }

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

  workouts.push(workout);
  console.log(workouts);
  form.classList.add("hidden");
  form.reset();
  inputType.value = type;
});

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
