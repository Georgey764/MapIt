const inputField = document.querySelector("#formInput");
const submitButton = document.querySelector("#formBtn");
const formContainer = document.querySelector(".form");
const myForm = document.querySelector("#myForm");
const startBtn = document.querySelectorAll(".home-button");

// On clicking start
startBtn.forEach((cur) => {
  cur.addEventListener("click", () => {
    console.log("hi");
    formContainer.classList.remove("hidden");
    document.body.style.overflowY = "hidden";
  });
});

// On clicking submit
let errorUP = false;
let loadUp = false;

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = new FormData(document.querySelector("#myForm"));
  if (!loadUp) {
    document
      .querySelector(".form")
      .insertAdjacentHTML(
        "afterbegin",
        "<p class='errorMsg'><span class='danger-sign'></span> <span class='errorMsgText'>Loading...</span></p>"
      );
    loadUp = true;
  }
  fetch(
    "https://script.google.com/macros/s/AKfycbwSt5oxaLIprIlMIi26CPaTUxhjuXAoq9S5qz-l2VZRN6jFQh53LRmzAVEgoRRJGCuEpw/exec",
    {
      method: "post",
      body: data,
    }
  )
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      if (text == "Error Validating URL") {
        if (!errorUP) {
          document.querySelector(".errorMsgText").innerHTML =
            "This is an invalid URL";
          document.querySelector(".danger-sign").innerHTML = "⚠";
          document.querySelector("#formInput").style.border = "1px solid red";
          document.querySelector("#formInput").style.background = "#FDF7F7";
        }
        errorUP = true;
        setTimeout(() => {
          document.querySelector(".errorMsg").remove();
          document.querySelector("#formInput").style.border = "1px solid black";
          document.querySelector("#formInput").style.background = "white";
          errorUP = false;
          loadUp = false;
        }, 1500);
      } else {
        window.location.href = `index.html?id=${text}`;
      }
    })
    .catch((error) => console.log(error));
});
