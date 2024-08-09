// Get the modal
var modal = document.getElementById("successModal");

// Get the form
var form = document.getElementById("myForm");

// Add event listener to the form for form submission
form.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Check if all required fields are filled
  if (validateForm()) {
    // If all fields are filled, show the success modal
    modal.style.display = "block";
  } else {
    // If any required field is empty, alert the user
    alert("Please fill out all required fields.");
  }
});

// Function to validate the form
function validateForm() {
  var inputs = document.querySelectorAll("input[required]");
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].value.trim()) {
      return false; // Return false if any required field is empty
    }
  }
  return true; // Return true if all required fields are filled
}

// Close the modal when the user clicks on <span> (x)
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
  location.reload(); // Reload the page after modal is closed
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
