let slideIndex = 0;
let timer;

function showSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });
  slides[slideIndex].style.display = "block";
  dots[slideIndex].classList.add("active");
}

function currentSlide(n) {
  clearInterval(timer);
  showSlide((slideIndex = n - 1));
}

function autoSlide() {
  timer = setInterval(() => {
    showSlide((slideIndex += 1));
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  showSlide(slideIndex);
  autoSlide();
});

// JavaScript code to prevent default action of anchor tag
document.addEventListener("DOMContentLoaded", function () {
  var scrollLink = document.getElementById("shp");

  // Check if the URL contains the anchor reference to #renderedDiv
  if (window.location.hash === "#renderedDiv") {
    // If it does, prevent the default behavior
    scrollLink.addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
});
