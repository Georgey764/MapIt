const inputField = document.querySelector("#formInput");
const submitButton = document.querySelector("#formBtn");
const myForm = document.querySelector("#myForm");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = new FormData(document.querySelector("#myForm"));

  fetch(
    "https://script.google.com/macros/s/AKfycbydEk4K6D8ExRKUpkHntFhISd0NbdHxjvvoV0LRZ9sRC8yAYrC46Vad9xf8-wqPkUfbXA/exec",
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
            "<p class='errorMsg'>The URL is invalid.</p>"
          );
        document.querySelector(".errorMsg").style.color = "red";
        setTimeout(() => {
          document.querySelector(".errorMsg").remove();
        }, 3000);
      } else {
        window.location.href = `index.html?id=${text}`;
      }
    })
    .catch((error) => console.log(error));
});
