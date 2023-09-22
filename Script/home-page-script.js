const inputField = document.querySelector("#formInput");
const submitButton = document.querySelector("#formBtn");
const myForm = document.querySelector("#myForm");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = new FormData(document.querySelector("#myForm"));

  fetch(
    "https://script.google.com/macros/s/AKfycbx_7mRYbBD-pFLnSgs1UjtVfDl6pUzSF7xPenKG1bkTiFGczGJkCnqDd8vMTetNFfiz0w/exec",
    {
      method: "post",
      body: data,
    }
  )
    .then((response) => response.text())
    .then((text) => {
      if (text == "The URL is invalid.") {
        console.log("The URL is invalid.");
      } else {
        window.location.href = `index.html?id=${text}`;
      }
    })
    .catch((error) => console.log(error));
});
