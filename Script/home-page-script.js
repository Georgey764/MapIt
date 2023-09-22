const inputField = document.querySelector("#formInput");
const submitButton = document.querySelector("#formBtn");
const myForm = document.querySelector("#myForm");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = new FormData(document.querySelector("#myForm"));

  fetch(
    "https://script.google.com/macros/s/AKfycbwaTnVRfCZ8bVQQQwJnTbXIy6BBB-93sGXz7nFAf7b6CcVjbFZ9yrifo8J3i1qjVA_gdg/exec",
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
