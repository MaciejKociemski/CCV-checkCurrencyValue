// Selectors
const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");
const body = document.body;
const switchBtn = document.getElementById("switchBtn");

// Initial values
let fromCurrency = localStorage.getItem("fromCurrency") || "GMD";
let toCurrency = localStorage.getItem("toCurrency") || "PLN";
let amountValue = localStorage.getItem("amountValue") || 100;

[fromCur.value, toCur.value] = [fromCurrency, toCurrency];
amount.value = amountValue;

// Function to set up currency options
function setupCurrencyOptions(select, initialCode) {
  for (let curCode in Country_List) {
    const selected = curCode === initialCode ? "selected" : "";
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${curCode}" ${selected}>${curCode}</option>`
    );
  }
}

// Function to toggle between light and dark mode
function toggleDarkMode() {
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  body.style.backgroundColor = isDarkMode ? "#121212" : "#999";
}

// Function to update flag image
function updateFlagImage(select) {
  const code = select.value;
  const imgTag = select.parentElement.querySelector("img");
  imgTag.src = `https://flagcdn.com/48x36/${Country_List[
    code
  ].toLowerCase()}.png`;
}

// Event listeners for currency dropdowns
[fromCur, toCur].forEach((select, i) => {
  setupCurrencyOptions(select, i === 0 ? fromCurrency : toCurrency);
  select.addEventListener("change", () => {
    updateFlagImage(select);
  });
});

// Function to get exchange rate from API
async function getExchangeRate() {
  amountValue = amount.value || 100;
  localStorage.setItem("amountValue", amountValue);

  exRateTxt.innerText = "Getting exchange rate...";
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/93ffb97de52b52b333dbd9c9/latest/${fromCurrency}`
    );
    const result = await response.json();
    const exchangeRate = result.conversion_rates[toCurrency];
    localStorage.setItem("exchangeRate", exchangeRate); // storing values in localStorage
    const totalExRate = (amountValue * exchangeRate).toFixed(2);
    exRateTxt.innerText = `${amountValue} ${fromCurrency} = ${totalExRate} ${toCurrency}`;
  } catch (error) {
    // reading values from  localStorage 
    exRateTxt.innerText = "Using stored exchange rate...";
  }
}

// Event listener for the switch button
switchBtn.addEventListener("click", toggleDarkMode);

// Event listeners for window load, button click, and exchange icon click
window.addEventListener("load", () => {
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exIcon.addEventListener("click", () => {
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
  localStorage.setItem("fromCurrency", fromCurrency);
  localStorage.setItem("toCurrency", toCurrency);
  [fromCur.value, toCur.value] = [fromCurrency, toCurrency];
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  getExchangeRate();
});
