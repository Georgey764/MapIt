var map = L.map("map").setView([37.8283, -93.5795], 5);

const markers = [];

function reverseGeocode(lat, lon) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then((response) => response.json())
    .then(function (data) {
      return data;
    });
}

var redIcon = L.icon({
  iconUrl: "Script/../Photos/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "Script/../Photos/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

fetch(
  "https://script.google.com/macros/s/AKfycby1yohzIwdkBiLJ9eft4N2jLxd3J0_bHcXIql3dns0yHNiO8b6lV9BKnBIFccRUHzuq/exec"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (text) {
    for (let i = 1; i < text.length; i++) {
      const [, lat, lng] = text[i];

      const marker = L.marker([lat, lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(
          `PLACE HOLDER
          `
        );

      markers.push(marker);
    }
  })
  .catch(function (error) {
    console.error("Error:", error);
  });

map.on("click", (e) => {
  const {
    latlng: { lat, lng },
  } = e;

  const marker = L.marker([lat, lng], { icon: redIcon })
    .addTo(map)
    .bindPopup(
      `PLACE HOLDER
    `
    );

  markers.push(marker);

  document.querySelector("#formModal").classList.remove("hidden");
  document.querySelector("#modalOverlay").classList.remove("hidden");

  document.querySelector("#formLat").value = `${lat}`;
  document.querySelector("#formLng").value = `${lng}`;

  console.log(reverseGeocode(lat, lng));
});

document.querySelector(`#myForm`).addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector("#formModal").classList.add("hidden");
  document.querySelector("#modalOverlay").classList.add("hidden");

  let data = new FormData(document.querySelector("#myForm"));

  fetch(
    "https://script.google.com/macros/s/AKfycby1yohzIwdkBiLJ9eft4N2jLxd3J0_bHcXIql3dns0yHNiO8b6lV9BKnBIFccRUHzuq/exec",
    {
      method: "POST",
      body: data,
    }
  )
    .then((res) => res.text())
    .then((data) => {
      console.log("Post: " + data);
    })
    .catch((error) => console.log(error));

  document.querySelector("#formName").value = "";
});

// Search Bar
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
})
  .on("markgeocode", function (e) {
    let zoomLevel = 12;

    if (e.geocode.properties.addresstype == "country") {
      zoomLevel = 4;
    }

    if (e.geocode.properties.addresstype == "state") {
      zoomLevel = 6;
    }

    const { lat, lng } = e.geocode.center;
    map.setView([lat, lng], zoomLevel);
  })
  .addTo(map);

const outOfModal = function () {
  document.querySelector("#formModal").classList.add("hidden");

  document.querySelector("#modalOverlay").classList.add("hidden");

  map.removeLayer(markers[markers.length - 1]);
};

document.querySelector("#modalCross").addEventListener("click", outOfModal);

document.querySelector("#modalOverlay").addEventListener("click", outOfModal);
