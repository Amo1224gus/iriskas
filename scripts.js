let level = 0;
let coins = 0;
let autoclicksPerSecond = 0;
let multiplier = 1;
let autoclickerPrice = 10;
let multiplierPrice = 50;

// Обновление отображения монет
function updateCoinsDisplay() {
    document.getElementById("level").textContent = level;
}

// Обработчик кликов по кошке
const cat = document.getElementById("cat");
cat.addEventListener("click", (event) => {
    level += multiplier;
    coins += multiplier;
    updateCoinsDisplay();

    // Анимация "+1" рядом с местом клика
    const floatingText = document.createElement("div");
    floatingText.textContent = `+${multiplier}`;
    floatingText.classList.add("floating-text");
    floatingText.style.left = `${event.clientX}px`;
    floatingText.style.top = `${event.clientY}px`;
    document.body.appendChild(floatingText);

    // Анимация уменьшения части кошки
    let offsetX = event.clientX - cat.getBoundingClientRect().left;
    let offsetY = event.clientY - cat.getBoundingClientRect().top;
    let originX = offsetX / cat.offsetWidth * 100;
    let originY = offsetY / cat.offsetHeight * 100;
    cat.style.transformOrigin = `${originX}% ${originY}%`;
    cat.style.transform = "scale(0.9)";

    setTimeout(() => {
        cat.style.transform = "scale(1)";
    }, 150);

    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
});

// Обработчик покупки автокликера
document.getElementById("buy-autoclicker").addEventListener("click", () => {
    if (coins >= autoclickerPrice) {
        coins -= autoclickerPrice;
        autoclicksPerSecond += 1;
        autoclickerPrice = Math.floor(autoclickerPrice * 1.5);
        document.getElementById("autoclicker-price").textContent = autoclickerPrice;
        document.getElementById("autoclick-info").textContent = `Автоклики: ${autoclicksPerSecond}/с`;
        updateCoinsDisplay();
    }
});

// Обработчик покупки множителя
document.getElementById("buy-multiplier").addEventListener("click", () => {
    if (coins >= multiplierPrice) {
        coins -= multiplierPrice;
        multiplier += 1;
        multiplierPrice = Math.floor(multiplierPrice * 2);
        document.getElementById("multiplier-price").textContent = multiplierPrice;
        updateCoinsDisplay();
    }
});

// Автоклики
setInterval(() => {
    if (autoclicksPerSecond > 0) {
        level += autoclicksPerSecond;
        coins += autoclicksPerSecond;
        updateCoinsDisplay();
    }
}, 1000);

// Переключение панели улучшений
const upgradeContainer = document.getElementById("upgrade-container");
document.getElementById("arrow-toggle").addEventListener("click", () => {
    if (upgradeContainer.style.width === "0px" || upgradeContainer.style.width === "") {
        upgradeContainer.style.width = "20%";
        document.getElementById("clicker-container").style.width = "80%";
    } else {
        upgradeContainer.style.width = "0px";
        document.getElementById("clicker-container").style.width = "100%";
    }
});

// Настройки
document.getElementById("settings-btn").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "block";
});

document.querySelector(".close-settings").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "none";
});

document.getElementById("theme-toggle").addEventListener("change", (event) => {
    document.body.classList.toggle("dark-theme", event.target.checked);
});

// Сохранение и загрузка файла JSON
document.getElementById("save-game").addEventListener("click", () => {
    const gameData = { level, coins, autoclicksPerSecond, multiplier, autoclickerPrice, multiplierPrice };
    const blob = new Blob([JSON.stringify(gameData)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "game-data.json";
    link.click();
});

document.getElementById("load-game").addEventListener("click", () => {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const gameData = JSON.parse(e.target.result);
            level = gameData.level;
            coins = gameData.coins;
            autoclicksPerSecond = gameData.autoclicksPerSecond;
            multiplier = gameData.multiplier;
            autoclickerPrice = gameData.autoclickerPrice;
            multiplierPrice = gameData.multiplierPrice;

            updateCoinsDisplay();
            document.getElementById("autoclicker-price").textContent = autoclickerPrice;
            document.getElementById("multiplier-price").textContent = multiplierPrice;
            document.getElementById("autoclick-info").textContent = `Автоклики: ${autoclicksPerSecond}/с`;
        };
        reader.readAsText(file);
    }
});
