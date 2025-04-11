// Variables
let amount = 0;
let amountPerClick = 1;
let autoclickerLevel = 0;
let autoclickerCost = 100;
let autoclickerRate = 2000; // Interval in ms
let upgradeCount = 0;
let upgrade1Cost = 10;
let upgrade2Cost = 50;
const priceIncreasePercent = 30;
const upgradeMultiplier = 2;  // Set multiplier for each upgrade

// DOM Elements
let amountButton = document.getElementById("amount");
let amountPerClickDisplay = document.getElementById("amountPerClickDisplay");
let counter = document.getElementById("counter");
let upgrade1 = document.getElementById("UPg1");
let upgrade2 = document.getElementById("UPg2");
let loadJsonBtn = document.getElementById("loadJsonBtn");
let autoclickerBtn = document.getElementById("autoclickerBtn");
let downloadJsonBtn = document.getElementById("downloadJsonBtn");
let autoclickerInfo = document.getElementById("autoclickerInfo");

// Save Progress to LocalStorage
function saveProgress() {
    let data = {
        amount,
        amountPerClick,
        upgrade1Cost,
        upgrade2Cost,
        autoclickerLevel,
        autoclickerCost,
        upgradeCount
    };
    localStorage.setItem("clickerData", JSON.stringify(data));
}

// Load Progress from LocalStorage
function loadProgress() {
    let savedData = localStorage.getItem("clickerData");
    if (savedData) {
        let data = JSON.parse(savedData);
        amount = data.amount ?? 0;
        amountPerClick = data.amountPerClick ?? 1;
        upgrade1Cost = data.upgrade1Cost ?? 10;
        upgrade2Cost = data.upgrade2Cost ?? 50;
        autoclickerLevel = data.autoclickerLevel ?? 0;
        autoclickerCost = data.autoclickerCost ?? 100;
        upgradeCount = data.upgradeCount ?? 0;
        updateDisplays();
    }
}

// Update UI
function updateDisplays() {
    counter.textContent = "Amount: " + amount;
    amountPerClickDisplay.textContent = "Amount per click: " + amountPerClick;
    upgrade1.innerHTML = `<span style="font-size: 1.2em;">Upgrade 1 (x${upgradeMultiplier} click) - Cost: ${upgrade1Cost}</span>`;
    upgrade2.innerHTML = `<span style="font-size: 1.2em;">Upgrade 2 (x${upgradeMultiplier} click) - Cost: ${upgrade2Cost}</span>`;
    autoclickerBtn.innerHTML = `<span style="font-size: 1.2em;">Autoclicker Level ${autoclickerLevel} - Cost: ${autoclickerCost}</span>`;
    autoclickerInfo.textContent = `Autoclicker Info: +${Math.floor((amountPerClick / 2) * autoclickerLevel)} per second`;
}

// Download Game Data as JSON
downloadJsonBtn.addEventListener("click", function () {
    let data = {
        amount,
        amountPerClick,
        upgrade1Cost,
        upgrade2Cost,
        autoclickerLevel,
        autoclickerCost,
        upgradeCount
    };

    // Convert to JSON string
    let jsonString = JSON.stringify(data);

    // Create a Blob from the JSON string
    let blob = new Blob([jsonString], { type: "application/json" });

    // Create an invisible link to trigger the download
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "game_data.json";  // The name of the file

    // Simulate a click on the link to start the download
    link.click();
});

// Load JSON from Input Field
loadJsonBtn.addEventListener("click", function () {
    let jsonInput = document.getElementById("jsonInput").value;
    
    try {
        let data = JSON.parse(jsonInput);
        
        // Make sure all required data is present
        if (
            data.amount !== undefined &&
            data.amountPerClick !== undefined &&
            data.upgrade1Cost !== undefined &&
            data.upgrade2Cost !== undefined &&
            data.autoclickerLevel !== undefined &&
            data.autoclickerCost !== undefined &&
            data.upgradeCount !== undefined
        ) {
            amount = data.amount;
            amountPerClick = data.amountPerClick;
            upgrade1Cost = data.upgrade1Cost;
            upgrade2Cost = data.upgrade2Cost;
            autoclickerLevel = data.autoclickerLevel;
            autoclickerCost = data.autoclickerCost;
            upgradeCount = data.upgradeCount;
            updateDisplays();
            alert("Game data loaded successfully!");
        } else {
            alert("Invalid JSON structure!");
        }
    } catch (e) {
        alert("Invalid JSON format!");
    }
});

// Click Button
amountButton.addEventListener("click", function () {
    amount += amountPerClick;
    updateDisplays();
    saveProgress();
});

// Upgrade 1
upgrade1.addEventListener("click", function () {
    if (amount >= upgrade1Cost) {
        amount -= upgrade1Cost;
        amountPerClick *= upgradeMultiplier; // Multiply the clicks per upgrade
        upgradeCount++;
        upgrade1Cost = Math.round(upgrade1Cost * (1 + priceIncreasePercent / 100));
        updateDisplays();
        saveProgress();
        alert(`Upgrade purchased! New cost: ${upgrade1Cost}`);
    } else {
        alert("Not enough coins!");
    }
});

// Upgrade 2
upgrade2.addEventListener("click", function () {
    if (amount >= upgrade2Cost) {
        amount -= upgrade2Cost;
        amountPerClick *= upgradeMultiplier; // Multiply the clicks per upgrade
        upgradeCount++;
        upgrade2Cost = Math.round(upgrade2Cost * (1 + priceIncreasePercent / 100));
        updateDisplays();
        saveProgress();
        alert(`Upgrade purchased! New cost: ${upgrade2Cost}`);
    } else {
        alert("Not enough coins!");
    }
});

// Autoclicker
let autoclickerInterval;
autoclickerBtn.addEventListener("click", function () {
    if (amount >= autoclickerCost) {
        amount -= autoclickerCost;
        autoclickerLevel++;
        autoclickerCost = Math.round(autoclickerCost * 1.5); // Cost increases by 1.5 each purchase

        saveProgress();
        alert(`Autoclicker upgraded to Level ${autoclickerLevel}! New cost: ${autoclickerCost}`);

        if (autoclickerInterval) clearInterval(autoclickerInterval);

        let autoclickerIncome = Math.floor((amountPerClick / 2) * autoclickerLevel);

        autoclickerInfo.textContent = `Autoclicker Info: +${autoclickerIncome} per second`;

        // Start autoclicker interval
        autoclickerInterval = setInterval(() => {
            amount += autoclickerIncome;
            updateDisplays();
        }, autoclickerRate);
    } else {
        alert("Not enough coins!");
    }
});

// Load progress on startup
window.onload = function () {
    loadProgress();
    updateDisplays();
};
