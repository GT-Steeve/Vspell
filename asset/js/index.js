const clickImage = document.querySelector(".click-start");

let visible = false;

// Animation fondu
setInterval(() => {
    visible = !visible;
    clickImage.style.opacity = visible ? "1" : "0";
}, 1500);

// Redirection au clic
clickImage.addEventListener("click", (e) => {
    e.stopPropagation(); // évite tout autre clic
    window.location.href = "play.html";
});