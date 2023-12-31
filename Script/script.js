const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (id == null || String(id).length != 44) {
  window.location.href = "home-page.html";
}

const scriptURL = `https://script.google.com/macros/s/AKfycbzzkh3ORVSeQArF-Hw63R_FFwxuYC7Gx1XFdRmP9UdnbdLme9fZYYFhJ_eRIKKJzyAu/exec?id=${id}`;

const markers = [];
const map = L.map("map").setView([39.8283, -98.5795], 5);

function reverseGeocode(lat, lon) {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then((response) => response.json())
    .then(function (data) {
      return data;
    });
}

function exitMarkMode() {
  document.querySelector("#mark_mode").innerHTML = "";
  document.querySelector("#map").classList.remove("outline");
  map.removeEventListener("click");
}

function removeDataFromForm() {
  document.querySelector("#formName").value = "";
  document.querySelector("#formGuest").value = "";
  document.querySelector("#formDuration").value = "";
  document.querySelector("#formPurpose").value = "";
  document.querySelector("#formFeedback").value = "";
  document.querySelector("#zip").innerHTML = "Loading...";
  document.querySelector("#place").innerHTML = "Loading...";
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

fetch(scriptURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (text) {
    for (let i = 1; i < text.length; i++) {
      const [, lat, lng] = text[i];

      const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

      markers.push(marker);
    }
  })
  .catch(function (error) {
    console.error("Error:", error);
  });

document.querySelector("#btn_mark").addEventListener("click", () => {
  this.map.classList.add("outline");
  document.querySelector("#mark_mode").insertAdjacentHTML(
    "afterbegin",
    `<div id="mark_text">Place your origin on the map!</div>
      <div id="btn_exit">EXIT MARK MODE</div>
      `
  );

  document.querySelector("#btn_exit").addEventListener("click", exitMarkMode);

  map.addEventListener("click", function onMapClick(e) {
    exitMarkMode();

    const {
      latlng: { lat, lng },
    } = e;

    const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

    markers.push(marker);

    // for dates
    let dateNow = new Date(Date.now());
    let date =
      ("0" + dateNow.getMonth()).slice(-2) +
      "/" +
      ("0" + dateNow.getDate()).slice(-2) +
      "/" +
      dateNow.getFullYear();

    // for reverse Geocode
    reverseGeocode(lat, lng)
      .then((response) => {
        const zip = response.address?.postcode
          ? response.address.postcode
          : "Not Found";
        const city = response.address?.city ? response.address.city : "";
        const county = response.address?.county ? response.address.county : "";
        const state = response.address?.state ? response.address.state : "";
        const country = response.address?.country
          ? response.address.country
          : "";
        let place = [city, county, state, country]
          .filter((cur, i) => {
            if (cur != "") {
              return cur;
            }
          })
          .join(", ");
        if (place == "") {
          place = "Not Found";
        }
        document.querySelector("#zip").innerHTML = zip;
        document.querySelector("#place").innerHTML = place;
        document.querySelector("#formName").value = `${place}`;
        document.querySelector(".formSelected>p>i").classList.remove("hidden");
      })
      .catch((error) => console.log(error));

    document.querySelector("#formModal").classList.remove("hidden");
    document.querySelector("#modalOverlay").classList.remove("hidden");

    document.querySelector("#formDate").value = `${date}`;
    document.querySelector("#formLat").value = `${lat}`;
    document.querySelector("#formLng").value = `${lng}`;
  });
});

document.querySelector(`#myForm`).addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector("#formModal").classList.add("hidden");
  document.querySelector("#modalOverlay").classList.add("hidden");

  let data = new FormData(document.querySelector("#myForm"));

  fetch(scriptURL, {
    method: "POST",
    body: data,
    mode: "cors",
  })
    .then((res) => res.text())
    .then((data) => {
      console.log("Post: " + data);
    })
    .catch((error) => console.log(error));

  removeDataFromForm();
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

// On clicking the edit button on the form
document.querySelector(".formEdit").addEventListener("click", () => {
  markers[markers.length - 1].remove();

  document.querySelector(
    "#zip"
  ).innerHTML = `<input placeholder="Enter your postal code" id="editFormZip" type="number">`;
  document.querySelector(
    "#place"
  ).innerHTML = `<input placeholder="Enter your address" autocomplete="off" required id="editFormPlace" type="text">`;

  let place = "";
  let zip = "";

  // On blurring the edit forms
  function removeMarker() {
    markers[markers.length - 1].remove();
    removeEventListener("click", removeMarker);
  }

  document.querySelector("#editFormPlace").addEventListener("blur", () => {
    place = document.querySelector("#editFormPlace").value;
    zip = document.querySelector("#editFormZip").value;

    if (place.trim() != "") {
      let query = place + " " + zip;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          const lat = data[0].lat;
          const lng = data[0].lon;
          document.querySelector("#formLat").value = `${lat}`;
          document.querySelector("#formLng").value = `${lng}`;
          const marker = L.marker([lat, lng], { icon: redIcon })
            .addTo(map)
            .bindPopup(
              `PLACE HOLDER
    `
            );
          markers.push(marker);
          document
            .querySelector("#modalCross")
            .addEventListener("click", removeMarker);
          document
            .querySelector("#modalOverlay")
            .addEventListener("click", removeMarker);
        })
        .catch((error) => console.log(error));
    }
  });

  document.querySelector("#editFormPlace").addEventListener("blur", () => {
    place = document.querySelector("#editFormPlace").value;

    document.querySelector("#formName").value = place;

    if (zip.trim() != "" && place.trim() != "") {
      let query = place + ", " + zip;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          const lat = data[0].lat;
          const lng = data[0].lon;
          document.querySelector("#formLat").value = `${lat}`;
          document.querySelector("#formLng").value = `${lng}`;
          const marker = L.marker([lat, lng], { icon: redIcon })
            .addTo(map)
            .bindPopup(
              `PLACE HOLDER
    `
            );
        })
        .catch((error) => console.log(error));
    }
  });
});

// On clicking side bar

const outOfModal = function () {
  document.querySelector("#formModal").classList.add("hidden");

  document.querySelector("#modalOverlay").classList.add("hidden");

  document.querySelector(".formSelected>p>i").classList.add("hidden");

  removeDataFromForm();

  map.removeEventListener("click");

  markers[markers.length - 1].remove();
};

document.querySelector("#modalCross").addEventListener("click", outOfModal);
document.querySelector("#modalOverlay").addEventListener("click", outOfModal);

document.querySelector("#center_icon").addEventListener("click", () => {
  map.setView([39.8283, -98.5795], 5);
});
