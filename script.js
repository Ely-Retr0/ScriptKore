document.addEventListener("DOMContentLoaded", function() {
    const news = [
        "!Telcel es HACKEADO!",
        "Nueva vulnerabilidad zero-day en OpenSSH",
        "Lanzamiento de la nueva versión de Nmap",
        "Ataques de ransomware incrementan un 40%"
    ];

    let currentIndex = 0;
    const contentDiv = document.getElementById("carousel-content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function updateCarousel() {
        contentDiv.innerHTML = `<h2>${news[currentIndex]}</h2>`;
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % news.length;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + news.length) % news.length;
        updateCarousel();
    });
});