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
myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = new FormData(document.querySelector("#myForm"));

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
        document
          .querySelector("#myForm")
          .insertAdjacentHTML(
            "afterend",
            "<p style='color:red;text-align:center;' class='errorMsg'>The URL is invalid.</p>"
          );
        setTimeout(() => {
          document.querySelector(".errorMsg").remove();
        }, 3000);
      } else {
        window.location.href = `index.html?id=${text}`;
      }
    })
    .catch((error) => console.log(error));
});
