function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Your form processing logic here (if needed)

  // Reset all input fields
  document.getElementById("eventForm").reset();

  // Refresh the page
  window.location.reload();
}
