navigator.geolocation.getCurrentPosition(
  function (position) {
    //  console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coord = [latitude, longitude];
    console.log(coord);
    var map = L.map("map").setView(coord, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coord)
      .addTo(map)
      .bindPopup("A pretty CSS popup.<br> Easily customizable.")
      .openPopup();
  },
  function () {
    alert("Could not get position");
  }
);
