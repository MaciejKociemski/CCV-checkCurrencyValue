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
let fromCurrency = "GMD";
let toCurrency = "PLN";
let amountValue = 100;
const exchangeRates = {
  GMD: { PLN: 0.0605, GMD: 1 },
  PLN: { GMD: 16.54, PLN: 1 },
};

[fromCur.value, toCur.value] = [fromCurrency, toCurrency];
amount.value = amountValue;

// Function to set up currency options
function setupCurrencyOptions(select, initialCode) {
  select.innerHTML = "";
  for (let curCode in exchangeRates) {
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
  body.style.backgroundColor = isDarkMode ? "#121212" : "#daa520";
}

// Function to update flag image
function updateFlagImage(select) {
  const code = select.value;
  const imgTag = select.parentElement.querySelector("img");
  imgTag.src = `https://flagcdn.com/48x36/${Country_List[
    code
  ].toLowerCase()}.png`;
}

// Function to update currency options
function updateCurrencyOptions() {
  [fromCur, toCur].forEach((select, i) => {
    const initialCode = i === 0 ? fromCurrency : toCurrency;
    setupCurrencyOptions(select, initialCode);
  });
}

// Event listeners for currency dropdowns
[fromCur, toCur].forEach((select, i) => {
  setupCurrencyOptions(select, i === 0 ? fromCurrency : toCurrency);
  select.addEventListener("change", () => {
    updateFlagImage(select);
    updateCurrencyOptions();
    getExchangeRate();
  });
});


function getExchangeRate() {
  
  const isAmountValid = /^[0-9]+(\.[0-9]+)?$/.test(amount.value);

  
  if (typeof Notiflix !== 'undefined') {
    if (!isAmountValid) {
     
      Notiflix.Notify.Failure("enter correct value in amount field");
      return;
    }

    amountValue = parseFloat(amount.value) || 100;
    const exchangeRate = exchangeRates[fromCurrency][toCurrency];

    const totalExRate = (amountValue * exchangeRate).toFixed(2);
    exRateTxt.innerText = `${amountValue} ${fromCurrency} = ${totalExRate} ${toCurrency}`;
  } else {
   
    alert(
      "Notiflix was not loaded correctly. Try again or check the configuration"
    );
  }
}


// Event listener for the switch button
switchBtn.addEventListener("click", toggleDarkMode);

// Event listeners for window load, button click, and exchange icon click
window.addEventListener("load", () => {
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  updateCurrencyOptions();
  getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exIcon.addEventListener("click", () => {
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
  [fromCur.value, toCur.value] = [fromCurrency, toCurrency];
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  getExchangeRate();
});
