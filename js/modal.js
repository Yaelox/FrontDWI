document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("privacyModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalSpan = document.getElementsByClassName("close")[0];
    const acceptBtn = document.getElementById("acceptBtn");

    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeModalSpan.onclick = function() {
        modal.style.display = "none";
    }

    acceptBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
