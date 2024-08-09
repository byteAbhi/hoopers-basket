function toggleForm() {
  var form = document.getElementById("myForm");
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

var likeCount = 0;
var dislikeCount = 0;
var isLiked = false;
var isDisliked = false;

function toggleLike() {
  if (!isLiked) {
    likeCount++;
    document.getElementById("like-count").innerText = likeCount;
    isLiked = true;
    isDisliked = false;
    document.querySelector(".like-btn").classList.add("active");
    document.querySelector(".dislike-btn").classList.remove("active");
  } else {
    likeCount--;
    document.getElementById("like-count").innerText = likeCount;
    isLiked = false;
    document.querySelector(".like-btn").classList.remove("active");
  }
}

function toggleDislike() {
  if (!isDisliked) {
    dislikeCount++;
    document.getElementById("dislike-count").innerText = dislikeCount;
    isDisliked = true;
    isLiked = false;
    document.querySelector(".dislike-btn").classList.add("active");
    document.querySelector(".like-btn").classList.remove("active");
  } else {
    dislikeCount--;
    document.getElementById("dislike-count").innerText = dislikeCount;
    isDisliked = false;
    document.querySelector(".dislike-btn").classList.remove("active");
  }
}
