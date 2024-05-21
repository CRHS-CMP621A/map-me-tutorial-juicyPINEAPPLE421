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
  },
  function () {
    alert("Could not get position");
  }
);

form.addEventListener("submit", function (e) {
  e.preventDefault(); // code for adding map marker...
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  //   L.marker([lat, lng]).addTo(map).bindPopup("Workout").openPopup();
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

  inputDistance.value = null;
  inputDuration.value = null;
  inputCadence.value = null;
});
